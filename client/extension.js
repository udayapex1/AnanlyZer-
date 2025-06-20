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
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = 'analyzer.analyzeWithCode';
	statusBarItem.text = '$(beaker) Analyze';
	statusBarItem.tooltip = 'Click to analyze code complexity';
	statusBarItem.show();
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
				const response = await axios.post('https://ananlyzer.onrender.com/api/analysis/analyze', { code });

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

				// Webview panel with enhanced UI
				const panel = vscode.window.createWebviewPanel(
					'analysisReport',
					'📊 Code Analysis Report',
					vscode.ViewColumn.One,
					{
						enableScripts: true,
						retainContextWhenHidden: true
					}
				);

				// Generate the HTML template with proper data binding
				panel.webview.html = generateEnhancedHTML({
					algorithmName,
					timeComplexity,
					spaceComplexity,
					suggestions,
					companies
				});
			});
		} catch (error) {
			vscode.window.showErrorMessage(`Analysis failed: ${error.message}`);
			outputChannel.appendLine(`[ERROR] ${error.message}`);
			outputChannel.show();
		}
	});

	context.subscriptions.push(disposable);
}

function generateEnhancedHTML(data) {
	const { algorithmName, timeComplexity, spaceComplexity, suggestions, companies } = data;

	// Generate suggestions HTML
	const suggestionsHTML = suggestions.map(suggestion =>
		`<li>${escapeHtml(suggestion)}</li>`
	).join('');

	// Generate companies HTML
	const companiesHTML = companies.map(company =>
		`<div class="company-tag">${escapeHtml(company)}</div>`
	).join('');

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	<title>Code Analysis Dashboard</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}

		body {
			font-family: 'Segoe UI', system-ui, sans-serif;
			background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
			color: #e2e8f0;
			min-height: 100vh;
			position: relative;
			overflow-x: hidden;
		}

		/* Animated background particles */
		body::before {
			content: '';
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
						radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
						radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
			animation: float 20s ease-in-out infinite;
			pointer-events: none;
			z-index: -1;
		}

		@keyframes float {
			0%, 100% { transform: translateY(0px) rotate(0deg); }
			33% { transform: translateY(-20px) rotate(120deg); }
			66% { transform: translateY(20px) rotate(240deg); }
		}

		.container {
			max-width: 1200px;
			margin: 0 auto;
			padding: 2rem;
			position: relative;
			z-index: 1;
		}

		.header {
			text-align: center;
			margin-bottom: 3rem;
			padding: 2rem 0;
		}

		.header h1 {
			font-size: 2.5rem;
			font-weight: 700;
			background: linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			margin-bottom: 0.5rem;
			animation: glow 2s ease-in-out infinite alternate;
		}

		@keyframes glow {
			from { filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.3)); }
			to { filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.4)); }
		}

		.subtitle {
			font-size: 1.1rem;
			color: #94a3b8;
			font-weight: 300;
		}

		.grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: 1.5rem;
			margin-bottom: 2rem;
		}

		.section {
			background: rgba(30, 41, 59, 0.4);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(148, 163, 184, 0.1);
			border-radius: 16px;
			padding: 1.5rem;
			position: relative;
			overflow: hidden;
			transition: all 0.3s ease;
			animation: slideUp 0.6s ease-out;
		}

		.section:hover {
			transform: translateY(-3px);
			box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
			border-color: rgba(16, 185, 129, 0.3);
		}

		.section::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 3px;
			background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6);
			opacity: 0;
			transition: opacity 0.3s ease;
		}

		.section:hover::before {
			opacity: 1;
		}

		@keyframes slideUp {
			from {
				opacity: 0;
				transform: translateY(20px);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}

		.section-header {
			display: flex;
			align-items: center;
			margin-bottom: 1rem;
		}

		.section-icon {
			font-size: 1.5rem;
			margin-right: 0.8rem;
			padding: 0.4rem;
			border-radius: 8px;
			background: rgba(16, 185, 129, 0.1);
			animation: pulse 2s infinite;
		}

		@keyframes pulse {
			0%, 100% { transform: scale(1); }
			50% { transform: scale(1.05); }
		}

		.section-title {
			font-size: 1.2rem;
			font-weight: 600;
			color: #f1f5f9;
		}

		.section-content {
			font-size: 1rem;
			line-height: 1.6;
			color: #cbd5e1;
		}

		.algorithm-name {
			font-size: 1.1rem;
			font-weight: 700;
			color: #10b981;
			padding: 0.8rem;
			background: rgba(16, 185, 129, 0.1);
			border-radius: 8px;
			border-left: 3px solid #10b981;
		}

		.complexity-badge {
			display: inline-block;
			padding: 0.6rem 1.2rem;
			background: linear-gradient(135deg, #1e293b, #334155);
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 20px;
			font-family: 'Courier New', monospace;
			font-size: 1rem;
			font-weight: 600;
			color: #f59e0b;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		}

		.suggestions-list {
			list-style: none;
			padding: 0;
		}

		.suggestions-list li {
			background: rgba(59, 130, 246, 0.1);
			padding: 0.8rem;
			margin-bottom: 0.6rem;
			border-radius: 8px;
			border-left: 3px solid #3b82f6;
			transition: all 0.3s ease;
			cursor: pointer;
		}

		.suggestions-list li:hover {
			background: rgba(59, 130, 246, 0.2);
			transform: translateX(3px);
		}

		.suggestions-list li::before {
			content: '💡';
			margin-right: 0.6rem;
			font-size: 1rem;
		}

		.companies-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
			gap: 0.8rem;
		}

		.company-tag {
			background: linear-gradient(135deg, #8b5cf6, #6366f1);
			color: white;
			padding: 0.6rem 0.8rem;
			border-radius: 16px;
			text-align: center;
			font-weight: 600;
			font-size: 0.8rem;
			transition: all 0.3s ease;
			cursor: pointer;
		}

		.company-tag:hover {
			transform: scale(1.05);
			box-shadow: 0 6px 12px rgba(139, 92, 246, 0.3);
		}

		.footer {
			text-align: center;
			padding: 2rem 0;
			margin-top: 3rem;
			border-top: 1px solid rgba(148, 163, 184, 0.1);
		}

		.footer-content {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.8rem;
			flex-wrap: wrap;
		}

		.author-link {
			display: inline-flex;
			align-items: center;
			gap: 0.4rem;
			color: #3b82f6;
			text-decoration: none;
			font-weight: 600;
			padding: 0.6rem 1.2rem;
			background: rgba(59, 130, 246, 0.1);
			border-radius: 20px;
			transition: all 0.3s ease;
			border: 1px solid rgba(59, 130, 246, 0.2);
		}

		.author-link:hover {
			background: rgba(59, 130, 246, 0.2);
			transform: translateY(-2px);
			box-shadow: 0 6px 12px rgba(59, 130, 246, 0.2);
		}

		.github-icon {
			font-size: 1rem;
		}

		.full-width {
			grid-column: 1 / -1;
		}

		/* Responsive design */
		@media (max-width: 768px) {
			.container {
				padding: 1rem;
			}

			.header h1 {
				font-size: 2rem;
			}

			.grid {
				grid-template-columns: 1fr;
				gap: 1rem;
			}

			.section {
				padding: 1.2rem;
			}

			.companies-grid {
				grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
			}
		}

		/* Loading animation */
		.loading {
			opacity: 0;
			animation: fadeIn 0.8s ease-out 0.1s forwards;
		}

		@keyframes fadeIn {
			to { opacity: 1; }
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="header loading">
			<h1>Code Analysis Dashboard</h1>
			<p class="subtitle">Advanced Algorithm Performance Analysis</p>
		</div>

		<div class="grid">
			<div class="section loading">
				<div class="section-header">
					<div class="section-icon">🧠</div>
					<h2 class="section-title">Algorithm Detected</h2>
				</div>
				<div class="section-content">
					<div class="algorithm-name">${escapeHtml(algorithmName)}</div>
				</div>
			</div>

			<div class="section loading">
				<div class="section-header">
					<div class="section-icon">⏱️</div>
					<h2 class="section-title">Time Complexity</h2>
				</div>
				<div class="section-content">
					<div class="complexity-badge">${escapeHtml(timeComplexity)}</div>
				</div>
			</div>

			<div class="section loading">
				<div class="section-header">
					<div class="section-icon">💾</div>
					<h2 class="section-title">Space Complexity</h2>
				</div>
				<div class="section-content">
					<div class="complexity-badge">${escapeHtml(spaceComplexity)}</div>
				</div>
			</div>

			<div class="section loading full-width">
				<div class="section-header">
					<div class="section-icon">⚡</div>
					<h2 class="section-title">Optimization Suggestions</h2>
				</div>
				<div class="section-content">
					<ul class="suggestions-list">
						${suggestionsHTML}
					</ul>
				</div>
			</div>

			<div class="section loading full-width">
				<div class="section-header">
					<div class="section-icon">🏢</div>
					<h2 class="section-title">Frequently Asked By</h2>
				</div>
				<div class="section-content">
					<div class="companies-grid">
						${companiesHTML}
					</div>
				</div>
			</div>
		</div>

		<div class="footer loading">
			<div class="footer-content">
				<span>Crafted with ❤️ by</span>
				<a href="https://github.com/udayapex1" class="author-link">
					<span class="github-icon">⭐</span>
					<span>udayapex1</span>
				</a>
			</div>
		</div>
	</div>

	<script>
		// Add smooth scrolling and enhanced interactions
		document.addEventListener('DOMContentLoaded', function() {
			// Animate sections on load
			const sections = document.querySelectorAll('.section');
			sections.forEach((section, index) => {
				section.style.animationDelay = (index * 0.1) + 's';
			});

			// Add click effects to suggestion items
			const suggestions = document.querySelectorAll('.suggestions-list li');
			suggestions.forEach(item => {
				item.addEventListener('click', function() {
					this.style.transform = 'scale(0.98) translateX(3px)';
					setTimeout(() => {
						this.style.transform = 'translateX(3px)';
					}, 150);
				});
			});

			// Add ripple effect to company tags
			const companyTags = document.querySelectorAll('.company-tag');
			companyTags.forEach(tag => {
				tag.addEventListener('click', function(e) {
					const ripple = document.createElement('span');
					const rect = this.getBoundingClientRect();
					const size = Math.max(rect.width, rect.height);
					const x = e.clientX - rect.left - size / 2;
					const y = e.clientY - rect.top - size / 2;
					
					ripple.style.cssText = \`
						position: absolute;
						width: \${size}px;
						height: \${size}px;
						left: \${x}px;
						top: \${y}px;
						background: rgba(255, 255, 255, 0.3);
						border-radius: 50%;
						transform: scale(0);
						animation: ripple 0.6s ease-out;
						pointer-events: none;
					\`;
					
					this.style.position = 'relative';
					this.style.overflow = 'hidden';
					this.appendChild(ripple);
					
					setTimeout(() => {
						ripple.remove();
					}, 600);
				});
			});
		});

		// Add CSS for ripple animation
		const style = document.createElement('style');
		style.textContent = \`
			@keyframes ripple {
				to {
					transform: scale(2);
					opacity: 0;
				}
			}
		\`;
		document.head.appendChild(style);
	</script>
</body>
</html>`;
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};