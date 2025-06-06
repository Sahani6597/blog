import { useState } from 'react';
import { Helmet } from "react-helmet-async";

export default function AIHumanizer() {
  const [inputText, setInputText] = useState('');
  const [level, setLevel] = useState('medium');
  const [originalText, setOriginalText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copyStatus, setCopyStatus] = useState({ original: false, humanized: false });

  const copyToClipboard = async (text: string, type: 'original' | 'humanized') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Large-scale phrase replacement dictionary
  const generalReplacements = {
     "Appointment": ["meeting", "get-together", "time slot"],
      "Agreement": ["deal", "understanding", "promise"],
      "Analyze": ["check out", "look into", "study"],
      "Application": ["form", "request", "paperwork"],
      "Approve": ["okay", "give the go-ahead", "say yes"],
      "Arrange": ["set up", "fix", "organize"],
      "Assignment": ["task", "job", "work"],
      "Assistance": ["help", "support", "hand"],
      "Attend": ["come", "join", "show up"],
      "Balance": ["leftover", "rest", "what’s remaining"],
      "Budget": ["money plan", "funds", "cost plan"],
      "Candidate": ["applicant", "person trying", "interviewee"],
      "Capacity": ["ability", "space", "limit"],
      "Clarify": ["explain", "make clear", "clear up"],
      "Client": ["customer", "buyer", "person"],
      "Close": ["finish", "wrap up", "end"],
      "Collect": ["gather", "bring together", "fetch"],
      "Complete": ["finish", "do fully", "wrap up"],
      "Confirm": ["tell for sure", "give the green light", "say yes"],
      "Consult": ["talk with", "discuss", "ask advice"],
      "Contract": ["deal", "agreement", "paperwork"],
      "Coordinate": ["organize", "arrange", "work together"],
      "Counsel": ["advise", "guide", "help with advice"],
      "Deadline": ["last date", "due day", "final day"],
      "Deliver": ["give", "hand over", "bring"],
      "Demonstrate": ["show", "prove", "display"],
      "Deposit": ["payment", "advance money", "down payment"],
      "Describe": ["tell about", "explain", "say"],
      "Discuss": ["talk about", "chat about", "go over"],
      "Document": ["paper", "record", "file"],
      "Draft": ["rough copy", "first version", "outline"],
      "Effective": ["working well", "useful", "successful"],
      "Efficiency": ["speed and accuracy", "quickness", "how fast"],
      "Eligible": ["fit", "qualified", "allowed"],
      "Employee": ["worker", "staff", "team member"],
      "Encourage": ["support", "push", "cheer"],
      "Ensure": ["make sure", "guarantee", "confirm"],
      "Estimate": ["guess", "rough idea", "approximate"],
      "Evaluate": ["judge", "check", "assess"],
      "Event": ["occasion", "happening", "function"],
      "Exceed": ["go beyond", "cross", "do more than"],
      "Experience": ["know-how", "time spent", "practice"],
      "Expert": ["pro", "specialist", "guru"],
      "Export": ["send out", "ship out", "deliver outside"],
      "Extend": ["make longer", "increase", "add more time"],
      "Facility": ["place", "setup", "service"],
      "Feedback": ["comments", "response", "opinion"],
      "Finance": ["money matters", "funds", "budget"],
      "Focus": ["pay attention", "concentrate", "look closely"],
      "Forecast": ["guess", "prediction", "future idea"],
      "Form": ["document", "paper", "application"],
      "Fulfill": ["complete", "do fully", "carry out"],
      "Fund": ["money", "financial help", "investment"],
      "Goal": ["target", "aim", "objective"],
      "Guarantee": ["promise", "assurance", "security"],
      "Handle": ["manage", "deal with", "take care of"],
      "Highlight": ["point out", "show", "focus on"],
      "Hire": ["employ", "take on", "get someone"],
      "Implement": ["put into action", "do", "carry out"],
      "Improve": ["make better", "fix", "upgrade"],
      "Include": ["have", "contain", "cover"],
      "Income": ["money earned", "earnings", "salary"],
      "Increase": ["grow", "add more", "go up"],
      "Indicate": ["show", "point out", "suggest"],
      "Inform": ["tell", "notify", "let know"],
      "Initiate": ["start", "begin", "kick off"],
      "Inspect": ["check", "examine", "look closely"],
      "Install": ["set up", "put in place", "fix"],
      "Instruction": ["order", "direction", "guide"],
      "Insurance": ["protection plan", "safety cover", "security"],
      "Interest": ["attention", "curiosity", "money earned"],
      "Interview": ["chat for job", "talk for job", "meeting"],
      "Introduce": ["present", "show", "bring in"],
      "Invest": ["put money", "spend money to earn", "fund"],
      "Invoice": ["bill", "payment request", "charge paper"],
      "Issue": ["problem", "matter", "point"],
      "Join": ["come together", "be part of", "connect"],
      "Judgment": ["decision", "opinion", "call"],
      "Knowledge": ["know-how", "info", "understanding"],
      "Lead": ["guide", "head", "show way"],
      "Limit": ["maximum", "boundary", "cap"],
      "Loan": ["borrowed money", "advance money", "credit"],
      "Locate": ["find", "spot", "discover"],
      "Maintain": ["keep up", "take care of", "support"],
      "Manage": ["handle", "run", "look after"],
      "Meeting": ["gathering", "get-together", "session"],
      "Member": ["part of group", "person in", "participant"],
      "Mention": ["talk about", "say", "bring up"],
      "Modify": ["change", "adjust", "edit"],
      "Negotiate": ["bargain", "discuss deal", "talk terms"],
      "Notify": ["inform", "tell", "give heads up"],
      "Objective": ["goal", "target", "aim"],
      "Offer": ["proposal", "deal", "suggestion"],
      "Operate": ["run", "work", "control"],
      "Option": ["choice", "alternative", "pick"],
      "Order": ["request", "demand", "buy"],
      "Organize": ["arrange", "set up", "plan"],
      "Outcome": ["result", "effect", "end result"],
      "Outline": ["summary", "plan", "overview"],
      "Oversee": ["watch", "supervise", "manage"],
      "Participate": ["join", "take part", "be involved"],
      "Payment": ["money", "pay", "fee"],
      "Perform": ["do", "carry out", "execute"],
      "Plan": ["idea", "arrangement", "schedule"],
      "Policy": ["rule", "guideline", "procedure"],
      "Position": ["job", "role", "place"],
      "Possible": ["can be done", "maybe", "could happen"],
      "Practice": ["exercise", "rehearse", "do often"],
      "Prepare": ["get ready", "arrange", "make ready"],
      "Present": ["show", "give", "display"],
      "Prevent": ["stop", "avoid", "keep from happening"],
      "Priority": ["main thing", "most important", "top task"],
      "Process": ["way to do", "steps", "method"],
      "Produce": ["make", "create", "generate"],
      "Product": ["thing made", "item", "goods"],
      "Profit": ["money made", "earning", "gain"],
      "Project": ["work plan", "task", "assignment"],
      "Promote": ["push", "advertise", "support"],
      "Proof": ["evidence", "showing", "confirmation"],
      "Provide": ["give", "supply", "offer"],
      "Purchase": ["buy", "get", "order"],
      "Qualify": ["fit", "meet criteria", "be eligible"],
      "Quality": ["standard", "goodness", "level"],
      "Range": ["variety", "selection", "scope"],
      "Rate": ["price", "charge", "speed"],
      "Reason": ["cause", "why", "explanation"],
      "Receive": ["get", "accept", "take"],
      "Recommend": ["suggest", "advise", "propose"],
      "Record": ["note", "write down", "document"],
      "Reduce": ["cut down", "lower", "make less"],
      "Refer": ["send", "mention", "direct"],
      "Refund": ["money back", "return", "pay back"],
      "Register": ["sign up", "enroll", "join"],
      "Reject": ["say no", "turn down", "decline"],
      "Release": ["launch", "let go", "send out"],
      "Remain": ["stay", "be left", "continue"],
      "Remind": ["tell again", "prompt", "give heads up"],
      "Remove": ["take away", "delete", "get rid of"],
      "Renew": ["extend", "do again", "refresh"],
      "Repair": ["fix", "mend", "correct"],
      "Replace": ["change", "swap", "put new"],
      "Report": ["tell", "inform", "account"],
      "Request": ["ask for", "demand", "seek"],
      "Require": ["need", "must have", "demand"],
      "Reserve": ["book", "save", "hold"],
      "Respond": ["reply", "answer", "react"],
      "Result": ["outcome", "effect", "consequence"],
      "Review": ["look again", "check", "examine"],
      "Schedule": ["plan", "timetable", "calendar"],
      "Select": ["choose", "pick", "opt for"],
      "Service": ["help", "support", "work done"],
      "Settle": ["resolve", "finish", "agree"],
      "Sign": ["write name", "approve", "authorize"],
      "Solve": ["fix", "work out", "figure out"],
      "Submit": ["send in", "hand over", "turn in"],
      "Support": ["help", "assist", "back up"],
      "Supply": ["provide", "give", "deliver"],
      "Take": ["grab", "accept", "get"],
      "Terminate": ["end", "stop", "finish"],
      "Test": ["check", "try", "examine"],
      "Track": ["follow", "watch", "monitor"],
      "Transfer": ["move", "send", "shift"],
      "Treat": ["handle", "deal with", "manage"],
      "Try": ["attempt", "give a shot", "test"],
      "Understand": ["get", "know", "figure out"],
      "Update": ["refresh", "upgrade", "make new"],
      "Upgrade": ["improve", "make better", "update"],
      "Use": ["make use of", "apply", "utilize"],
      "Verify": ["check", "confirm", "validate"],
      "Visit": ["go to", "come by", "stop at"],
      "Wait": ["stay", "hold on", "pause"],
      "Warn": ["alert", "tell", "caution"],
      "Work": ["do", "perform", "carry out"],
      "Write": ["note down", "record", "put in words"],
 "Authenticate": ["verify", "check", "confirm"],
  "Bandwidth": ["data capacity", "connection speed", "data limit"],
  "Cache": ["temporary storage", "quick access", "saved data"],
  "Client-server": ["user and host", "requester and provider", "two ends"],
  "Cloud": ["online storage", "internet space", "remote server"],
  "Code": ["program", "script", "instructions"],
  "Compile": ["build", "put together", "assemble"],
  "Configure": ["set up", "arrange", "adjust"],
  "Data": ["information", "details", "figures"],
  "Database": ["data storage", "info bank", "records"],
  "Deploy": ["launch", "release", "put live"],
  "Encryption": ["coding", "locking", "scrambling data"],
  "Framework": ["platform", "structure", "base system"],
  "Function": ["job", "task", "operation"],
  "Hardware": ["physical parts", "machine components", "equipment"],
  "Interface": ["connection", "interaction point", "link"],
  "Internet": ["web", "online network", "net"],
  "JavaScript": ["JS", "scripting language", "programming language"],
  "Library": ["collection of code", "toolkit", "code bundle"],
  "Module": ["component", "part", "section"],
  "Network": ["system", "connection", "web"],
  "Optimization": ["making better", "improvement", "speeding up"],
  "Parameter": ["setting", "input", "variable"],
  "Performance": ["speed", "efficiency", "how well it works"],
  "Protocol": ["rules", "standard procedure", "method"],
  "Script": ["code", "program", "instructions"],
  "Server": ["host", "computer", "machine"],
  "Software": ["program", "application", "app"],
  "System": ["setup", "arrangement", "platform"],
  "Variable": ["changeable", "input", "value"],
  "Version": ["edition", "release", "update"],
  "Virtual": ["digital", "not physical", "simulated"],
  "Web": ["internet", "online", "network"],
  "Workflow": ["process", "steps", "sequence"],
  };

  const humanizeText = () => {
    const input = inputText.trim();
    setOriginalText(input);

    if (!input) {
      setOutputText("Please enter some text!");
      return;
    }

    let text = input;

    for (let key in generalReplacements) {
      const options = generalReplacements[key];
      const replacement = options[Math.floor(Math.random() * options.length)];
      const pattern = new RegExp("\\b" + key + "\\b", "gi");
      text = text.replace(pattern, match => {
        const isCapitalized = match[0] === match[0].toUpperCase();
        return isCapitalized
          ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
          : replacement;
      });
    }

    // Optional tone enhancer
    const fillerPhrases = [
      "Honestly speaking,",
      "To be fair,",
      "Let's be real,",
      "In plain words,",
      "Guess what,"
    ];

    const emojis = ["😄", "👉", "💬", "🔥", "✅"];

    let sentences = text.split(/(?<=[.!?])\s+/);

    sentences = sentences.map((s, index) => {
      if (level === "medium" && index % 2 === 0) {
        return fillerPhrases[Math.floor(Math.random() * fillerPhrases.length)] + " " + s;
      } else if (level === "heavy" && index % 2 === 1) {
        return s + " " + emojis[Math.floor(Math.random() * emojis.length)];
      }
      return s;
    });

    const finalText = sentences.join(" ").replace(/\s{2,}/g, " ").trim();
    setOutputText(finalText);
  };

  return (
    <>
      <Helmet>
        <title>AI Humanizer Tool – Make AI Text Sound Natural & Human</title>
        <meta name="description" content="Transform robotic or overly technical AI-generated text into natural, conversational, and relatable language using our AI Humanizer tool. Perfect for blogs, social media, and everyday communication." />
        <link rel="canonical" href="https://blog420.vercel.app/ai-humanizer" />
        <meta property="og:title" content="AI Humanizer Tool – Make AI Text Sound Natural & Human" />
        <meta property="og:description" content="Convert AI or robotic text into natural, human-like language easily and instantly with our free AI Humanizer." />
        <meta property="og:url" content="https://blog420.vercel.app/ai-humanizer" />
        <meta property="og:site_name" content="Blog420" />
        <meta property="og:image" content="https://res.cloudinary.com/dwv0d5mce/image/upload/v1747675377/download_gq6s4n.jpg" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Humanizer Tool – Make AI Text Sound Natural & Human" />
        <meta name="twitter:description" content="Convert AI-generated text into natural, human-like language with Blog420's free AI Humanizer tool." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dwv0d5mce/image/upload_v1747675377/download_gq6s4n.jpg" />
        <meta name="twitter:creator" content="@blog420" />
      </Helmet>
      <div className="p-5 min-h-screen bg-[#eef2f5]">
        <h2 className="text-2xl text-[#222] font-semibold mb-6">🧠 Accurate AI Text Humanizer</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="inputText" className="block font-semibold mb-2">
              Paste AI-generated content below:
            </label>
            <textarea
              id="inputText"
              className="w-full p-3 text-base border border-[#bbb] rounded-lg bg-white min-h-[150px]"
              placeholder="Example: In conclusion, it is important to note that AI is evolving..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="level" className="block font-semibold mb-2">
              Humanize Level:
            </label>
            <select
              id="level"
              className="w-full md:w-auto p-2 border border-[#aaa] rounded-md"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>

          <button
            onClick={humanizeText}
            className="px-5 py-2.5 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ✨ Humanize Text
          </button>

          <div className="grid md:grid-cols-2 gap-5 mt-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold">Original Text</h3>
                {originalText && (
                  <button
                    onClick={() => copyToClipboard(originalText, 'original')}
                    className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-2"
                  >
                    {copyStatus.original ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              <div className="p-3 border border-[#bbb] rounded-lg bg-white min-h-[100px] whitespace-pre-wrap">
                {originalText}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold">Humanized Text</h3>
                {outputText && (
                  <button
                    onClick={() => copyToClipboard(outputText, 'humanized')}
                    className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-2"
                  >
                    {copyStatus.humanized ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              <div className="p-3 border border-[#bbb] rounded-lg bg-white min-h-[100px] whitespace-pre-wrap">
                {outputText}
              </div>
            </div>
          </div>
        </div>

    
      </div>
    </>
  );
}