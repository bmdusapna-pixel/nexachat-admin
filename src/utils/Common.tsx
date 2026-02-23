

export const routerChange = (path: string, type: string, router: any) => {
    const handleRouteChange = (url: string) => {
        if (!url.includes(path)) {
            localStorage.removeItem(type);
        }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
        router.events.off("routeChangeStart", handleRouteChange);
    };
}


  export  function getCountryCodeFromEmoji(emoji : any) {
  if (!emoji || emoji.length < 2) return null;
  const codePoints = [...emoji].map(char => char.codePointAt(0) - 127397);
  return String.fromCharCode(...codePoints).toLowerCase(); // e.g. "in"
}