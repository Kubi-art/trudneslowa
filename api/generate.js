export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { situation, context, tone } = await request.json();

    const situationPrompts = {
      podwyzka: "prośbę o podwyżkę do szefa",
      zerwanie: "wiadomość o zerwaniu związku",
      reklamacja: "reklamację produktu lub usługi",
      przeprosiny: "przeprosiny",
      odmowa: "grzeczną odmowę",
      zwolnienie: "rezygnację z pracy"
    };

    const toneDescriptions = {
      formal: "oficjalny i profesjonalny",
      friendly: "przyjacielski i ciepły",
      direct: "bezpośredni i zwięzły"
    };

    const prompt = `Jesteś asystentem pomagającym pisać trudne wiadomości po polsku.

Sytuacja: ${situationPrompts[situation]}
Kontekst: ${context || 'brak dodatkowych informacji'}
Ton: ${toneDescriptions[tone]}

Wygeneruj 3 różne wersje tej wiadomości:
1. Wersja profesjonalna - formalna, pełna szacunku
2. Wersja empatyczna - ciepła, zrozumiała, z empatią
3. Wersja zwięzła - krótka, na temat, bez zbędnych słów

Każda wiadomość powinna być gotowa do skopiowania i wysłania. Zwróć TYLKO 3 wiadomości oddzielone znacznikiem |||

Format odpowiedzi:
wiadomość1|||wiadomość2|||wiadomość3`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Jesteś profesjonalnym asystentem pomagającym w pisaniu trudnych wiadomości. Zawsze piszesz po polsku.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    const generatedText = data.choices[0].message.content;
    const messages = generatedText.split('|||').map(msg => msg.trim());

    if (messages.length < 3) {
      throw new Error('Invalid response format');
    }

    return new Response(JSON.stringify({ messages: messages.slice(0, 3) }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
