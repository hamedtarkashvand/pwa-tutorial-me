if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((sw) => console.log('register'))
      .catch((err) =>
        console.log('not supported your browser this serviceWorker' , err)
      );
}