package id.doktertege.kalkulatoranak;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.view.View;
import android.accounts.Account;

import com.google.android.gms.auth.GoogleAuthUtil;
import com.google.android.gms.auth.UserRecoverableAuthException;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInStatusCodes;
import com.google.android.gms.common.api.Scope;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends Activity {
    private static final int GOOGLE_SIGN_IN = 7401;
    private static final String DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata";
    private static final String BACKUP_NAME = "medora-backup.enc";
    private WebView webView;
    private GoogleSignInAccount googleAccount;
    private final ExecutorService cloudExecutor = Executors.newSingleThreadExecutor();

    private class MedoraBridge {
        @JavascriptInterface public void signIn() {
            runOnUiThread(() -> {
                GoogleSignInOptions options = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestEmail()
                    .requestScopes(new Scope(DRIVE_SCOPE))
                    .build();
                Intent intent = GoogleSignIn.getClient(MainActivity.this, options).getSignInIntent();
                startActivityForResult(intent, GOOGLE_SIGN_IN);
            });
        }
        @JavascriptInterface public void uploadEncryptedBackup(String encryptedPayload) {
            if (encryptedPayload == null || encryptedPayload.length() > 7_000_000) {
                cloudCallback("window.medoraCloudBackupResult", false, "Ukuran backup tidak valid atau melebihi batas.");
                return;
            }
            cloudExecutor.execute(() -> {
                try {
                    String token = accessToken();
                    JSONObject metadata = new JSONObject();
                    metadata.put("name", BACKUP_NAME);
                    JSONArray parents = new JSONArray(); parents.put("appDataFolder");
                    metadata.put("parents", parents);
                    String boundary = "MEDORA_" + System.currentTimeMillis();
                    ByteArrayOutputStream body = new ByteArrayOutputStream();
                    body.write(("--" + boundary + "\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n").getBytes(StandardCharsets.UTF_8));
                    body.write(metadata.toString().getBytes(StandardCharsets.UTF_8));
                    body.write(("\r\n--" + boundary + "\r\nContent-Type: application/octet-stream\r\n\r\n").getBytes(StandardCharsets.UTF_8));
                    body.write(encryptedPayload.getBytes(StandardCharsets.UTF_8));
                    body.write(("\r\n--" + boundary + "--").getBytes(StandardCharsets.UTF_8));
                    // Keep exactly one app-private backup: update the existing file when present.
                    String query = URLEncoder.encode("name='" + BACKUP_NAME + "' and trashed=false", "UTF-8");
                    HttpURLConnection lookup = (HttpURLConnection) new URL("https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&pageSize=10&orderBy=createdTime%20desc&fields=files(id)&q=" + query).openConnection();
                    lookup.setRequestProperty("Authorization", "Bearer " + token);
                    lookup.setConnectTimeout(20000); lookup.setReadTimeout(20000);
                    int lookupCode = lookup.getResponseCode();
                    String lookupBody = readResponse(lookup, lookupCode);
                    lookup.disconnect();
                    if (lookupCode < 200 || lookupCode >= 300) throw new Exception("Gagal memeriksa backup lama di Drive (" + lookupCode + ").");
                    JSONArray existing = new JSONObject(lookupBody).optJSONArray("files");
                    String fileId = existing != null && existing.length() > 0 ? existing.getJSONObject(0).optString("id", "") : "";
                    String uploadUrl = "https://www.googleapis.com/upload/drive/v3/files" +
                        (fileId.isEmpty() ? "" : "/" + URLEncoder.encode(fileId, "UTF-8")) +
                        "?uploadType=multipart&fields=id,name";
                    HttpURLConnection connection = (HttpURLConnection) new URL(uploadUrl).openConnection();
                    connection.setRequestMethod(fileId.isEmpty() ? "POST" : "PATCH");
                    connection.setConnectTimeout(20000); connection.setReadTimeout(30000);
                    connection.setDoOutput(true);
                    connection.setRequestProperty("Authorization", "Bearer " + token);
                    connection.setRequestProperty("Content-Type", "multipart/related; boundary=" + boundary);
                    connection.getOutputStream().write(body.toByteArray());
                    int code = connection.getResponseCode();
                    String response = readResponse(connection, code);
                    connection.disconnect();
                    if (code < 200 || code >= 300) throw new Exception("Google Drive menolak backup (" + code + "). " + response);
                    cloudCallback("window.medoraCloudBackupResult", true, fileId.isEmpty()
                        ? "Backup terenkripsi berhasil dibuat di Google Drive."
                        : "Backup terenkripsi berhasil diperbarui di Google Drive.");
                } catch (Exception error) { cloudCallback("window.medoraCloudBackupResult", false, friendly(error)); }
            });
        }
        @JavascriptInterface public void downloadEncryptedBackup() {
            cloudExecutor.execute(() -> {
                try {
                    String token = accessToken();
                    String query = URLEncoder.encode("name='" + BACKUP_NAME + "' and trashed=false", "UTF-8");
                    HttpURLConnection list = (HttpURLConnection) new URL("https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&pageSize=1&orderBy=createdTime%20desc&fields=files(id,name)&q=" + query).openConnection();
                    list.setRequestProperty("Authorization", "Bearer " + token);
                    int listCode = list.getResponseCode();
                    String listBody = readResponse(list, listCode); list.disconnect();
                    if (listCode < 200 || listCode >= 300) throw new Exception("Gagal mencari backup di Drive (" + listCode + ").");
                    JSONArray found = new JSONObject(listBody).optJSONArray("files");
                    if (found == null || found.length() == 0) throw new Exception("Belum ada backup MEDORA di akun Google Drive ini.");
                    String fileId = found.getJSONObject(0).getString("id");
                    HttpURLConnection file = (HttpURLConnection) new URL("https://www.googleapis.com/drive/v3/files/" + URLEncoder.encode(fileId, "UTF-8") + "?alt=media").openConnection();
                    file.setRequestProperty("Authorization", "Bearer " + token);
                    int fileCode = file.getResponseCode();
                    String encrypted = readResponse(file, fileCode); file.disconnect();
                    if (fileCode < 200 || fileCode >= 300) throw new Exception("Gagal mengunduh backup (" + fileCode + ").");
                    cloudRestoreCallback(encrypted);
                } catch (Exception error) { cloudCallback("window.medoraCloudRestoreResult", false, friendly(error)); }
            });
        }
    }

    private String accessToken() throws Exception {
        GoogleSignInAccount account = googleAccount != null ? googleAccount : GoogleSignIn.getLastSignedInAccount(this);
        if (account == null || account.getAccount() == null) throw new Exception("Masuk ke Google terlebih dahulu.");
        googleAccount = account;
        return GoogleAuthUtil.getToken(this, account.getAccount(), "oauth2:" + DRIVE_SCOPE);
    }
    private String readResponse(HttpURLConnection connection, int code) throws Exception {
        InputStream stream = code >= 200 && code < 300 ? connection.getInputStream() : connection.getErrorStream();
        if (stream == null) return "";
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        byte[] buffer = new byte[8192]; int count;
        while ((count = stream.read(buffer)) != -1) output.write(buffer, 0, count);
        stream.close();
        return output.toString("UTF-8");
    }
    private String friendly(Exception error) {
        if (error instanceof UserRecoverableAuthException) return "Izin Google perlu dikonfirmasi kembali. Keluar lalu masuk Google lagi.";
        return error.getMessage() == null ? "Terjadi kesalahan saat mengakses Google Drive." : error.getMessage();
    }
    private void cloudCallback(String function, boolean success, String message) {
        try {
            JSONObject result = new JSONObject(); result.put("ok", success); result.put("message", message);
            runOnUiThread(() -> { if (webView != null) webView.evaluateJavascript(function + "(" + JSONObject.quote(result.toString()) + ")", null); });
        } catch (Exception ignored) { }
    }
    private void cloudRestoreCallback(String encrypted) {
        runOnUiThread(() -> { if (webView != null) webView.evaluateJavascript("window.medoraCloudRestorePayload(" + JSONObject.quote(encrypted) + ")", null); });
    }

    @SuppressWarnings("deprecation")
    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == GOOGLE_SIGN_IN) {
            try {
                googleAccount = GoogleSignIn.getSignedInAccountFromIntent(data).getResult(com.google.android.gms.common.api.ApiException.class);
                cloudCallback("window.medoraCloudSignInResult", true, googleAccount.getEmail() == null ? "Google terhubung." : googleAccount.getEmail());
            } catch (Exception error) {
                cloudCallback("window.medoraCloudSignInResult", false, "Login Google gagal: " + error.getMessage());
            }
        }
    }

    @SuppressWarnings("deprecation")
    @Override public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack(); else super.onBackPressed();
    }
    private boolean handleNavigation(WebView view, Uri uri) {
        String scheme = uri.getScheme();
        if ("file".equalsIgnoreCase(scheme)) return false;
        if ("https".equalsIgnoreCase(scheme)) {
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            try { startActivity(intent); } catch (ActivityNotFoundException error) { /* Keep untrusted web content outside the WebView bridge. */ }
        }
        return true;
    }
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(0xFFEAF3FF);
        getWindow().setNavigationBarColor(0xFFF3F7FD);
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        WebView web = new WebView(this); webView = web; web.setBackgroundColor(0xFFF3F7FD);
        WebSettings settings = web.getSettings(); settings.setJavaScriptEnabled(true); settings.setDomStorageEnabled(true); settings.setAllowFileAccess(true);
        web.addJavascriptInterface(new MedoraBridge(), "MedoraCloud");
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, String url) { return handleNavigation(view, Uri.parse(url)); }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) { return handleNavigation(view, request.getUrl()); }
        });
        setContentView(web); web.loadUrl("file:///android_asset/index.html");
    }
    @Override protected void onDestroy() { cloudExecutor.shutdown(); super.onDestroy(); }
}
