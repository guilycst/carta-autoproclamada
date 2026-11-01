// Cloudflare adds this fixed script at the edge; normalize only the HTML comparison.
const template = "<script>(function(){function c(){var b=a.contentDocument||(a.contentWindow&&a.contentWindow.document);if(b){var d=b.createElement('script');d.innerHTML=\"window.__CF$cv$params={r:'RAYTOKEN',t:'TIMETOKEN'};var l=window.parent.location,o;try{o=new URL(l.origin).origin}catch(e){try{o=new URL(new URL(l.href).origin).origin}catch(e){o=''}}var u='/cdn-cgi/challenge-platform/scripts/jsd/main.js?ray=RAYTOKEN',a=document.createElement('script');a.src=o?new URL(u,o).href:u;document.getElementsByTagName('head')[0].appendChild(a);\";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script>";
const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = new RegExp(escaped.replaceAll("RAYTOKEN", "[a-f0-9]{16,32}").replaceAll("TIMETOKEN", "[A-Za-z0-9+/=]{8,64}") + "(?=</body>)");

export function removeCloudflareJavaScriptDetection(html) {
  return html.replace(pattern, "");
}

export function assertNoCloudflareChallenge(status, mitigated, path) {
  if (status === 403 && mitigated === 'challenge') {
    const error = new Error(`Cloudflare requires a human challenge for ${path}.`);
    error.code = 'CLOUDFLARE_CHALLENGE';
    throw error;
  }
}
