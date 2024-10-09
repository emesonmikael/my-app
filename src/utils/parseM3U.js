// src/utils/parseM3U.js
export const parseM3U = async (url) => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.split('\n');
    const items = [];
    let currentItem = {};

    lines.forEach(line => {
      line = line.trim();
      if (line.startsWith('#EXTINF')) {
        const info = line.substring(line.indexOf(':') + 1);
        // Regex atualizada para capturar chaves com hífen
        const attrRegex = /([\w-]+)="([^"]*)"/g;
        let match;
        while ((match = attrRegex.exec(info)) !== null) {
          const key = match[1];
          const value = match[2];
          currentItem[key] = value;
        }
        // Extrair o título após a vírgula
        const commaIndex = info.indexOf(',');
        if (commaIndex !== -1) {
          currentItem.title = info.substring(commaIndex + 1).trim();
        }
      } else if (line && !line.startsWith('#')) {
        currentItem.url = line;
        items.push({ ...currentItem });
        currentItem = {};
      }
    });

    console.log('Itens parseados:', items);
    return items;
  } catch (error) {
    console.error('Erro ao parsear M3U:', error);
    return [];
  }
};