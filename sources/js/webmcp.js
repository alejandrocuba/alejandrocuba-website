if (typeof navigator !== 'undefined' && navigator.modelContext) {
  const tool = {
    name: 'get_portfolio_info',
    description: "Get general information about Alejandro Cuba Ruiz's biography, specialties, and links",
    inputSchema: { type: 'object', properties: {} },
    execute: async () => ({
      content: [{
        type: 'text',
        text: "Alejandro Cuba Ruiz is a Principal Front-End Engineer, Google Developer Expert in Angular, and ng-Champion based in Miami Beach, FL. Check out https://alejandrocuba.com/llms.txt for full biography and links."
      }]
    })
  };

  try {
    navigator.modelContext.provideContext?.({ tools: [tool] });
    navigator.modelContext.registerTool?.(tool);
  } catch (e) {
    console.error('WebMCP registration failed:', e);
  }
}
