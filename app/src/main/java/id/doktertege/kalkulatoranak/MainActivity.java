package id.doktertege.kalkulatoranak;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.view.View;

public class MainActivity extends Activity {
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(0xFFEAF3FF);
        getWindow().setNavigationBarColor(0xFFF3F7FD);
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        WebView web = new WebView(this);
        web.setBackgroundColor(0xFFF3F7FD);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme();
                if ("file".equalsIgnoreCase(scheme)) return false;
                if ("https".equalsIgnoreCase(scheme)) {
                    Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                    try {
                        startActivity(intent);
                    } catch (ActivityNotFoundException error) {
                        view.loadUrl(uri.toString());
                    }
                    return true;
                }
                return true;
            }
        });
        setContentView(web);
        web.loadUrl("file:///android_asset/index.html");
    }
}