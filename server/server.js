import express from 'express';
import cors from 'cors';
import { spawn, exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Array of 32 varied, executive internal monologue & thinking phrases
const INTERNAL_MONOLOGUE_PHRASES = [
  "Thinking through next steps...",
  "Synthesizing contextual intelligence...",
  "Formulating execution strategy...",
  "Analyzing workspace parameters...",
  "Reviewing system context & memory...",
  "Connecting workflow dots...",
  "Structuring tactical action plan...",
  "Consulting capability blueprints...",
  "Aligning workspace context...",
  "Verifying available tool interfaces...",
  "Calibrating reasoning trajectory...",
  "Evaluating optimal pathways...",
  "Cross-referencing schema registry...",
  "Synthesizing analytical brief...",
  "Reviewing workflow parameters...",
  "Analyzing context vectors...",
  "Structuring response logic...",
  "Harmonizing operational state...",
  "Processing internal thoughts...",
  "Organizing executive findings...",
  "Validating parameters & safety guidelines...",
  "Refining execution strategy...",
  "Assembling action blueprint...",
  "Parsing task dependencies...",
  "Assessing operational boundaries...",
  "Distilling workspace data...",
  "Mapping decision trajectory...",
  "Orchestrating task pipeline...",
  "Refining analytical thoughts...",
  "Deliberating next move...",
  "Pondering optimal solution...",
  "Connecting reasoning threads..."
];

let lastPhraseIndex = -1;
function getRandomThinkingPhrase() {
  let idx;
  do {
    idx = Math.floor(Math.random() * INTERNAL_MONOLOGUE_PHRASES.length);
  } while (idx === lastPhraseIndex && INTERNAL_MONOLOGUE_PHRASES.length > 1);
  lastPhraseIndex = idx;
  return INTERNAL_MONOLOGUE_PHRASES[idx];
}

// Format internal tools into clean human-readable actions
function formatHumanToolCall(toolName, toolInfo, promptText = '') {
  const params = toolInfo?.parameters || {};
  
  if (toolName === 'view_file') {
    const file = params.AbsolutePath || '';
    // When inspecting internal schemas, IDE configs, system logs, or scratchpads, present as internal monologue
    if (
      !file ||
      file.includes('.gemini') || 
      file.includes('mcp') || 
      file.includes('node_modules') || 
      file.includes('.system_generated') ||
      file.includes('antigravity-ide') ||
      file.includes('scratchpad')
    ) {
      return {
        displayName: getRandomThinkingPhrase(),
        category: 'thinking',
        isWrite: false
      };
    }
    const filename = file.split(/[\\/]/).pop();
    return {
      displayName: `Reading file ${filename}`,
      category: 'file',
      isWrite: false
    };
  }

  if (toolName === 'call_mcp_tool') {
    const server = params.ServerName || '';
    const tool = params.ToolName || '';
    const args = params.Arguments || {};

    // Email tool
    if (server.includes('email') || tool.includes('email')) {
      const emailMatch = promptText ? promptText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/) : null;
      const to = args.to || (emailMatch ? emailMatch[1] : 'recipient');
      const subject = args.subject || 'Zoho Activity Summary';
      return {
        displayName: `Sending Email to ${to}`,
        category: 'email',
        server,
        tool,
        args,
        target: to,
        isWrite: true,
        details: {
          'Action': 'Send Transactional Email',
          'To': to,
          'Subject': subject,
          'Headline': args.headline || 'Executive Report',
          'Service': server || 'email-service'
        }
      };
    }

    // Zoho Books
    if (server.includes('zoho')) {
      const isWrite = tool.includes('create') || tool.includes('update') || tool.includes('delete') || tool.includes('stop') || tool.includes('resume');
      let actionClean = tool.replace('ZohoBooks_', '').replace(/_/g, ' ');
      
      let humanName = `Querying Zoho Books (${actionClean})`;
      if (tool.includes('list_invoices')) humanName = 'Retrieving Zoho Books invoices';
      else if (tool.includes('list_expenses')) humanName = 'Retrieving Zoho Books expenses';
      else if (tool.includes('list_contacts')) humanName = 'Retrieving Zoho Books contacts';
      else if (tool.includes('create_invoice')) humanName = 'Create Customer Invoice in Zoho Books';
      else if (tool.includes('create_expense')) humanName = 'Record Expense in Zoho Books';

      return {
        displayName: humanName,
        category: 'finance',
        server,
        tool,
        args,
        isWrite,
        target: isWrite ? (args.customer_name || (args.amount ? `Amount: ${args.amount}` : 'Zoho Books Record')) : '',
        details: {
          'Service': 'Zoho Books',
          'Operation': actionClean,
          'Parameters': Object.keys(args).length > 0 ? JSON.stringify(args) : 'Workspace Query'
        }
      };
    }

    // Clockify
    if (server.includes('clockify')) {
      const isWrite = tool.includes('start') || tool.includes('stop') || tool.includes('log') || tool.includes('create');
      
      let humanName = 'Retrieving Clockify timer data';
      if (tool.includes('get_current_timer')) humanName = 'Fetching latest active timer entry from Clockify';
      else if (tool.includes('get_current_user_profile')) humanName = 'Checking Clockify user profile';
      else if (tool.includes('get_summary_report') || tool.includes('get_detailed_report')) humanName = 'Fetching Clockify timesheet report';
      else if (tool.includes('list_')) humanName = `Fetching Clockify ${tool.replace('list_', '')}`;
      else if (tool.includes('start')) humanName = `Starting Clockify timer for "${args.description || 'Task'}"`;
      else if (tool.includes('stop')) humanName = 'Stopping Clockify timer';

      return {
        displayName: isWrite 
          ? humanName 
          : `${humanName} • ⚡ Consumes 1 API Request`,
        category: 'time',
        server,
        tool,
        args,
        isWrite,
        apiQuotaNotice: 'Consumes 1 Clockify API request under plan limits',
        target: args.description || '',
        details: {
          'Service': 'Clockify',
          'Action': humanName,
          'Plan Quota': 'Consumes 1 Clockify API request',
          'Task / Description': args.description || 'Current Task'
        }
      };
    }

    // Trello
    if (server.includes('trello')) {
      const isWrite = tool.includes('Write') || tool.includes('create') || tool.includes('delete');
      const action = args.action || '';
      let humanName = 'Reading Trello boards & cards';
      let details = {
        'Service': 'Trello'
      };

      if (tool === 'trelloWriteCard' || tool.includes('WriteCard')) {
        if (action === 'add_comment') {
          humanName = `Post Comment on Trello Card`;
          details['Operation'] = 'Post Comment to Existing Card';
          if (args.text) details['Comment Text'] = args.text;
          if (args.cardId) details['Target Card ID'] = args.cardId;
        } else if (action === 'update_comment') {
          humanName = `Update Comment on Trello Card`;
          details['Operation'] = 'Update Existing Comment';
          if (args.text) details['New Text'] = args.text;
        } else if (action === 'create') {
          humanName = `Create New Card: "${args.name || 'New Task'}"`;
          details['Operation'] = 'Create New Card';
          details['Card Title'] = args.name || 'Task Card';
          if (args.desc) details['Description'] = args.desc;
        } else if (action === 'update') {
          humanName = `Update Trello Card Details`;
          details['Operation'] = 'Update Card Fields';
          if (args.name) details['New Name'] = args.name;
          if (args.desc) details['New Description'] = args.desc;
          if (args.due) details['Due Date'] = args.due;
        } else if (action === 'move') {
          humanName = `Move Trello Card`;
          details['Operation'] = 'Move Card to List';
        } else if (action === 'mark_done') {
          humanName = `Mark Trello Card Complete`;
          details['Operation'] = 'Mark Card as Complete';
        } else if (action === 'archive') {
          humanName = `Archive Trello Card`;
          details['Operation'] = 'Archive Card';
        } else if (action === 'attach_label' || action === 'detach_label') {
          humanName = `${action === 'attach_label' ? 'Attach' : 'Detach'} Label on Trello Card`;
          details['Operation'] = `${action === 'attach_label' ? 'Attach' : 'Detach'} Label`;
        } else {
          humanName = `Modify Trello Card (${action || 'Write'})`;
          details['Operation'] = action || 'Card Mutation';
        }
      } else if (tool.includes('trelloReadInbox')) {
        humanName = 'Checking Trello inbox';
      } else if (tool.includes('trelloReadCard')) {
        humanName = 'Reading Trello card details';
      } else if (tool.includes('trelloReadBoard')) {
        humanName = 'Reading Trello board';
      } else if (tool.includes('trelloSearch')) {
        humanName = `Searching Trello cards for "${args.query || ''}"`;
      } else if (tool.includes('trelloWriteChecklist')) {
        humanName = action === 'create' ? `Create Checklist on Card` : `Update Checklist Item`;
        details['Operation'] = humanName;
      } else if (tool.includes('trelloWriteList')) {
        humanName = `Create List: "${args.name || 'New List'}"`;
        details['Operation'] = 'Create List on Board';
      }

      return {
        displayName: humanName,
        category: 'tasks',
        server,
        tool,
        args,
        isWrite,
        target: args.name || args.text || args.cardId || '',
        details
      };
    }

    return {
      displayName: `${server}: ${tool.replace(/_/g, ' ')}`,
      category: 'tool',
      server,
      tool,
      args,
      isWrite: false
    };
  }

  if (toolName === 'write_to_file' || toolName === 'replace_file_content' || toolName === 'multi_replace_file_content') {
    const filename = (params.TargetFile || '').split(/[\\/]/).pop();
    return {
      displayName: `Modify file: ${filename}`,
      category: 'file',
      isWrite: true,
      target: params.TargetFile,
      details: {
        'Action': 'Write / Replace File Content',
        'File': filename,
        'Path': params.TargetFile
      }
    };
  }

  if (toolName === 'run_command') {
    return {
      displayName: `Execute Command: ${params.CommandLine}`,
      category: 'command',
      isWrite: true,
      target: params.CommandLine,
      details: {
        'Action': 'Execute Shell Command',
        'Command': params.CommandLine,
        'Directory': params.Cwd || 'Workspace Root'
      }
    };
  }

  if (toolName === 'list_dir') {
    return {
      displayName: 'Scanning workspace directory',
      category: 'file',
      isWrite: false
    };
  }

  if (toolName === 'grep_search') {
    return {
      displayName: `Searching codebase for "${params.Query || ''}"`,
      category: 'file',
      isWrite: false
    };
  }

  return {
    displayName: getRandomThinkingPhrase(),
    category: 'thinking',
    isWrite: false
  };
}

// Get registered MCP servers from agy
app.get('/api/mcp/servers', async (req, res) => {
  try {
    const { stdout } = await execPromise('agy.exe mcp list');
    const lines = stdout.trim().split('\n');
    const servers = [];
    if (lines.length > 1) {
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(/\s{2,}/);
        if (parts.length >= 3) {
          servers.push({
            name: parts[0],
            type: parts[1],
            status: parts[2],
            commandOrUrl: parts[3] || ''
          });
        }
      }
    }
    res.json({ success: true, servers });
  } catch (error) {
    console.error('Error fetching MCP servers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// System status
app.get('/api/status', async (req, res) => {
  try {
    const { stdout: version } = await execPromise('agy.exe --version');
    res.json({
      success: true,
      status: 'ready',
      cliVersion: version.trim(),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.json({ success: false, status: 'error', error: err.message });
  }
});

// Streaming Chat endpoint with clear tool categorization and interactive write permissions
app.post('/api/chat', (req, res) => {
  const { prompt, conversationId, confirmedWriteAction = false } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (event, data) => {
    try {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    } catch {
      // client disconnected
    }
  };

  const args = ['-p', prompt, '--output-format', 'stream-json', '--sandbox'];
  if (confirmedWriteAction) {
    args.push('--dangerously-skip-permissions');
  }
  if (conversationId) {
    args.push('--conversation', conversationId);
  }

  console.log(`[Antigravity Server] Launching agy [sandbox: true, approvedWrite: ${confirmedWriteAction}] for: "${prompt.slice(0, 60)}..."`);
  sendEvent('status', { message: 'Thinking & analyzing request...' });

  const agyProcess = spawn('agy.exe', args, {
    cwd: process.cwd()
  });

  let buffer = '';
  let pendingWriteDetected = null;

  agyProcess.stdout.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const parsed = JSON.parse(trimmed);
        
        if (parsed.event === 'init') {
          sendEvent('init', {
            conversationId: parsed.conversation_id,
            tools: parsed.init?.tools || []
          });
        } 
        else if (parsed.event === 'step_update') {
          const step = parsed.step_update || {};
          
          if (step.text_delta) {
            sendEvent('text_delta', { text: step.text_delta });
          }
          if (step.thought_delta) {
            sendEvent('thought_delta', { thought: step.thought_delta });
          }
          
          // Format tool activity clearly
          if (step.tool_name) {
            const formatted = formatHumanToolCall(step.tool_name, step.tool_info, prompt);
            if (formatted) {
              sendEvent('activity', { 
                name: formatted.displayName,
                category: formatted.category,
                state: step.state,
                apiQuotaNotice: formatted.apiQuotaNotice
              });

              // Check if tool is a write/mutating action and user has not yet confirmed
              if (formatted.isWrite && !confirmedWriteAction) {
                pendingWriteDetected = {
                  id: `perm-${Date.now()}`,
                  action: formatted.tool || step.tool_name,
                  displayName: formatted.displayName,
                  category: formatted.category,
                  target: formatted.target || '',
                  details: formatted.details || {},
                  prompt: prompt
                };
              }
            }
          }
          sendEvent('step', step);
        }
        else if (parsed.event === 'result') {
          // If a genuine write permission was blocked or pending
          if (pendingWriteDetected && !confirmedWriteAction) {
            sendEvent('permission_required', pendingWriteDetected);
          } else if (parsed.result?.denied_actions && parsed.result.denied_actions.length > 0 && !confirmedWriteAction) {
            const denied = parsed.result.denied_actions[0];
            const lowerPrompt = prompt.toLowerCase();
            
            // Strictly check if the prompt is asking for a READ operation
            const isReadRequest = /^(get|list|show|fetch|read|check|summarise|summarize|view|display|what|who|how|is|are|tell)\b/.test(lowerPrompt) ||
                                  lowerPrompt.includes('latest entry') ||
                                  lowerPrompt.includes('current status') ||
                                  lowerPrompt.includes('active timer') ||
                                  lowerPrompt.includes('check my') ||
                                  lowerPrompt.includes('read inbox');

            // READ REQUESTS NEVER REQUIRE PERMISSION!
            if (!isReadRequest) {
              const emailMatch = prompt.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
              let displayName = denied.display_name || denied.action;
              let category = 'security';
              let details = {
                'Action': denied.display_name || denied.action,
                'Triggered by Request': prompt
              };
              let target = '';

              if (emailMatch || lowerPrompt.includes('email') || lowerPrompt.includes('send')) {
                const recipient = emailMatch ? emailMatch[1] : 'Specified Recipient';
                displayName = `Send Email to ${recipient}`;
                category = 'email';
                target = recipient;
                details = {
                  'Action': 'Send Summary Email',
                  'Recipient': recipient,
                  'Service': process.env.EMAIL_MCP_NAME || 'email-service',
                  'Report Focus': 'Executive Summary & Zoho Report'
                };
              } else if (denied.action === 'command' || lowerPrompt.includes('run') || lowerPrompt.includes('exec')) {
                displayName = 'Execute Shell Command';
                category = 'command';
                details = {
                  'Action': 'Command Line Execution',
                  'Environment': 'Workspace Sandbox',
                  'Request': prompt
                };
              } else if (lowerPrompt.includes('start timer') || lowerPrompt.includes('stop timer')) {
                displayName = 'Clockify Timer Mutation Authorization';
                category = 'time';
                target = 'Clockify';
                details = {
                  'Service': 'Clockify',
                  'Action': 'Start/Stop Time Tracker',
                  'Request': prompt
                };
              } else if (lowerPrompt.includes('create invoice') || lowerPrompt.includes('record expense')) {
                displayName = 'Zoho Books Write Authorization';
                category = 'finance';
                target = 'Zoho Books';
                details = {
                  'Service': 'Zoho Books',
                  'Action': 'Create/Update Accounting Record',
                  'Request': prompt
                };
              }

              sendEvent('permission_required', pendingWriteDetected || {
                id: `perm-${Date.now()}`,
                action: denied.action,
                displayName,
                category,
                target,
                details,
                prompt: prompt
              });
            }
          }
          sendEvent('result', parsed.result);
        }
        else {
          sendEvent('agent_event', parsed);
        }
      } catch (e) {
        sendEvent('raw', { text: trimmed });
      }
    }
  });

  agyProcess.stderr.on('data', (data) => {
    const errText = data.toString().trim();
    if (errText) {
      if (errText.includes('permission that headless mode cannot prompt for') || errText.includes('denied permission')) {
        const lowerPrompt = prompt.toLowerCase();
        const isReadRequest = /^(get|list|show|fetch|read|check|summarise|summarize|view|display|what|who|how|is|are|tell)\b/.test(lowerPrompt) ||
                              lowerPrompt.includes('latest entry') ||
                              lowerPrompt.includes('current status') ||
                              lowerPrompt.includes('active timer') ||
                              lowerPrompt.includes('check my') ||
                              lowerPrompt.includes('read inbox');

        if (!confirmedWriteAction && !isReadRequest && pendingWriteDetected) {
          sendEvent('permission_required', pendingWriteDetected);
        }
      } else {
        console.warn('[agy stderr]:', errText);
        sendEvent('stderr', { text: errText });
      }
    }
  });

  agyProcess.on('close', (code) => {
    console.log(`[Antigravity Server] agy closed with exit code ${code}`);
    if (buffer.trim()) {
      try {
        const parsed = JSON.parse(buffer.trim());
        if (parsed.event === 'result') {
          if (pendingWriteDetected && !confirmedWriteAction) {
            sendEvent('permission_required', pendingWriteDetected);
          }
          sendEvent('result', parsed.result);
        } else {
          sendEvent('agent_event', parsed);
        }
      } catch {
        sendEvent('raw', { text: buffer.trim() });
      }
    }
    sendEvent('done', { exitCode: code });
    res.end();
  });

  agyProcess.on('error', (err) => {
    console.error('[Antigravity Server] Error running agy:', err);
    sendEvent('error', { message: err.message });
    res.end();
  });

  res.on('close', () => {
    if (!res.writableEnded && agyProcess.exitCode === null) {
      console.log('[Antigravity Server] Client closed connection, terminating agy.');
      agyProcess.kill();
    }
  });
});

app.listen(PORT, () => {
  console.log(`[Antigravity Consumer Server] Bridge running at http://localhost:${PORT}`);
});
