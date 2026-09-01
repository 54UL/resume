let config = {};

export async function loadConfig(){
  config = await fetch("./config.json").then(r => r.json());
}

export function getConfig(){ return config; }
