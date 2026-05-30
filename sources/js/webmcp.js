if (typeof navigator !== 'undefined' && navigator.modelContext) {
  const tools = [
    {
      name: "get_portfolio_info",
      description: "Get general information about Alejandro Cuba Ruiz's biography, specialties, and links",
      inputSchema: {
        type: "object",
        properties: {}
      },
      execute: async () => {
        return {
          content: [
            {
              type: "text",
              text: "Alejandro Cuba Ruiz is a Principal Front-End Engineer, Google Developer Expert in Angular, and ng-Champion based in Miami Beach, FL. Check out https://alejandrocuba.com/llms.txt for full biography and links."
            }
          ]
        };
      }
    }
  ];

  // Try providing context (for backward compatibility / user's explicit request)
  if (typeof navigator.modelContext.provideContext === 'function') {
    try {
      navigator.modelContext.provideContext({ tools });
      console.log("WebMCP tools provided via provideContext");
    } catch (e) {
      console.error("WebMCP provideContext failed:", e);
    }
  }

  // Try registering tools (current WebMCP standard)
  if (typeof navigator.modelContext.registerTool === 'function') {
    try {
      for (const tool of tools) {
        navigator.modelContext.registerTool(tool);
        console.log(`WebMCP tool '${tool.name}' registered`);
      }
    } catch (e) {
      console.error("WebMCP registerTool failed:", e);
    }
  }
}
