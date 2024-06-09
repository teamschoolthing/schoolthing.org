self.addEventListener("push", function (event) {
    var data = event.data.json();
    console.log("rcvd", data);
    event.waitUntil(
      registration.showNotification(data.title, {
        body: data.body,
        image: "/icons/loadingLogo.png",
        badge: "/icons/loadingLogo.png",
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          url: data.url,
        },
      })
    );
  });
  self.addEventListener('notificationclick', function (event)
  {
      //For root applications: just change "'./'" to "'/'"
      //Very important having the last forward slash on "new URL('./', location)..."
      const rootUrl = new URL('./', event.notification.data.url).href; 
      event.notification.close();
      event.waitUntil(
          clients.matchAll().then(matchedClients =>
          {
              for (let client of matchedClients)
              {
                  if (client.url.indexOf(rootUrl) >= 0)
                  {
                      return client.focus();
                  }
              }
  
              return clients.openWindow(rootUrl).then(function (client) { client.focus(); });
          })
      );
  });