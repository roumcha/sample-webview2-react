using Microsoft.UI.Xaml;
using Microsoft.Web.WebView2.Core;
using System.Reflection;
using System.Text;

namespace WebView2WithReact;

public sealed partial class MainWindow : Window
{
    public MainWindow()
    {
        this.InitializeComponent();
        WebViewTest();
    }

    async void WebViewTest()
    {
        var assemblyLocation = Assembly.GetExecutingAssembly().Location;
        var assemblyDir = new FileInfo(assemblyLocation).Directory;
        await _webView.EnsureCoreWebView2Async();
        _webView.Language = "ja-JP";

        _webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
            "webapps",
            Path.Combine(assemblyDir!.FullName, "WebApps\\react-with-webview2-0.0.0"),
            CoreWebView2HostResourceAccessKind.DenyCors
        );

        _webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
            "dev",
            "ここに react アプリのフォルダーを指定",
            CoreWebView2HostResourceAccessKind.DenyCors
        );

        _webView.Source = new Uri("https://dev/index.html");

        for (int i = 0; i < 10000; i += 100)
        {
            var sb = new StringBuilder();
            sb.Append("window.addNotes([");
            // id と text で大体 25000 個くらいまで一括追加できた
            for (int j = i; j < i + 100; j++) sb.Append($"{{id:{j}, text:'{j}'}},");
            sb.Append("]);");
            await WaitGridIdle();
            await _webView.ExecuteScriptAsync(sb.ToString());
        }

        for (int i = 0; i < 20; i++)
        {
            await WaitGridIdle();
            await _webView.ExecuteScriptAsync($"window.removeNote({i});");
        }

        await WaitGridIdle();
        await _webView.ExecuteScriptAsync("window.updateNote({id: 25, text: 'world!'})");

        for (int i = -10; i <= -1; i++)
        {
            await WaitGridIdle();
            await _webView.ExecuteScriptAsync($"window.addNotes([{{id:{i}, text:'{i}'}}]);");
        }
    }

    private async Task WaitGridIdle()
    {
        bool loaded;
        do
        {
            await Task.Delay(10);
            loaded = await _webView.ExecuteScriptAsync("window.idle") == "true";
        } while (!loaded);
    }
}
