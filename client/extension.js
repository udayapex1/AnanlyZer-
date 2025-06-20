const vscode = require('vscode');
const axios = require('axios');

const algorithmCompanyMap = {
	"Bubble Sort": ["Amazon", "Walmart", "TCS"],
	"Merge Sort": ["Google", "Meta", "Microsoft"],
	"QuickSort": ["Google", "Apple", "Adobe"],
	"Binary Search": ["Amazon", "Microsoft", "Uber"],
	"Dijkstra": ["Google", "Facebook", "Microsoft"],
	"DFS": ["Amazon", "Flipkart", "Bloomberg"],
	"BFS": ["Microsoft", "Google", "Uber"],
	"Dynamic Programming": ["Amazon", "Google", "Meta"],
	"Kruskal": ["Microsoft", "Cisco", "Nutanix"],
	"Prim": ["Oracle", "Cisco", "Adobe"]
};

function activate(context) {
	console.log('Extension "analyzer" is activated!');
	const outputChannel = vscode.window.createOutputChannel('analyzer');

	let disposable = vscode.commands.registerCommand('analyzer.analyzeWithCode', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor found!');
			return;
		}

		const code = editor.document.getText();

		try {
			await vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "analyZer: Analyzing code complexity...",
				cancellable: false
			}, async () => {
				const response = await axios.post('http://localhost:3000/api/analysis/analyze', { code });

				let {
					algorithmName,
					timeComplexity,
					spaceComplexity,
					suggestions,
					companies
				} = response.data.analysis;

				// 🎯 Override company list if algorithm is known
				if (algorithmCompanyMap[algorithmName]) {
					companies = algorithmCompanyMap[algorithmName];
				}

				// Show popup summary
				vscode.window.showInformationMessage(
					`analyZer: ${algorithmName} | Time ${timeComplexity} | Space ${spaceComplexity}`
				);

				// Output channel
				outputChannel.clear();
				outputChannel.appendLine('╔══════════════════════════════════════════════╗');
				outputChannel.appendLine('║              🔍 CODE ANALYZER                ║');
				outputChannel.appendLine('╚══════════════════════════════════════════════╝\n');
				outputChannel.appendLine(`🧠 Algorithm: ${algorithmName}`);
				outputChannel.appendLine(`⏱️  Time Complexity: ${timeComplexity}`);
				outputChannel.appendLine(`💾 Space Complexity: ${spaceComplexity}\n`);
				outputChannel.appendLine('🚀 Optimization Suggestions:');
				suggestions.forEach((s, i) => outputChannel.appendLine(`  ${i + 1}. ${s}`));
				outputChannel.appendLine(`\n💼 Asked by: ${companies.join(', ')}`);
				outputChannel.appendLine('\nDeveloped by: https://github.com/udayapex1');
				outputChannel.show();

				// Webview panel with UI
				const panel = vscode.window.createWebviewPanel(
					'analysisReport',
					'📊 Code Analysis Report',
					vscode.ViewColumn.One,
					{}
				);

				const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Code Analysis</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #0f1117;
      color: #e5e7eb;
      padding: 2rem;
      line-height: 1.6;
    }
    h2 {
      color: #10b981;
      margin-top: 2rem;
      font-size: 1.3rem;
      border-left: 4px solid #10b981;
      padding-left: 0.8rem;
    }
    .card {
      background-color: #1a1d23;
      padding: 1.5rem;
      margin-top: 1rem;
      border-radius: 8px;
      box-shadow: 0 0 0 1px #2f333a;
    }
    ul {
      margin-top: 0.5rem;
      padding-left: 1.2rem;
    }
    li {
      margin-bottom: 0.5rem;
    }
    .footer {
      margin-top: 3rem;
      font-size: 0.9rem;
      text-align: center;
      color: #6b7280;
    }
    a {
      color: #3b82f6;
      text-decoration: none;
    }
    .emoji {
      font-size: 1.2rem;
      margin-right: 0.3rem;
    }
  </style>
</head>
<body>

  <h2><span class="emoji">🧠</span>Algorithm Detected</h2>
  <div class="card">
    <p>{{algorithmName}}</p>
  </div>

  <h2><span class="emoji">⏱️</span>Time Complexity</h2>
  <div class="card">
    <p>{{timeComplexity}}</p>
  </div>

  <h2><span class="emoji">💾</span>Space Complexity</h2>
  <div class="card">
    <p>{{spaceComplexity}}</p>
  </div>

  <h2><span class="emoji">⚡</span>Optimization Suggestions</h2>
  <div class="card">
    <ul>
      {{suggestions}}
    </ul>
  </div>

  <h2><span class="emoji">🏢</span>Frequently Asked By</h2>
  <div class="card">
    <p>{{companies}}</p>
  </div>

  <div class="footer">
    Developed by <a href="https://github.com/udayapex1" target="_blank">udayapex1</a>
  </div>

</body>
</html>`;

				panel.webview.html = htmlTemplate
					.replace('{{algorithmName}}', algorithmName)
					.replace('{{timeComplexity}}', timeComplexity)
					.replace('{{spaceComplexity}}', spaceComplexity)
					.replace('{{suggestions}}', suggestions.map(s => `<li>${s}</li>`).join(''))
					.replace('{{companies}}', companies.join(', '));
			});
		} catch (error) {
			vscode.window.showErrorMessage(`Analysis failed: ${error.message}`);
			outputChannel.appendLine(`[ERROR] ${error.message}`);
			outputChannel.show();
		}
	});

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};
