export function safeGet(key){
  try { return localStorage.getItem(key); } catch(e){ return null; }
}

export function safeSet(key, val){
  try { localStorage.setItem(key, val); } catch(e){}
}
