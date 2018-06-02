var prevNotificationUrl = "";

chrome.tabs.onUpdated.addListener(function (tabId, change, tab){
    if(tab.url !== prevNotificationUrl && change.status == "complete") {
        $.ajax({
            url: 'https://dehv.net/api/fact/get/all',
            type: "GET",
            data: $(this).serialize(),
            success: function(result) { 
                var num = 0;
                var hit = false;
    
                for(var i=0;i<result.length;i++) {
                    if(result[i].url == tab.url) {
                        num = i;
                        hit = true;
                        break;
                    }
                }
                var currentTab = tabId;
                var truth = result[num].truth;

                var listenerfunc = function(tab) {
                    if(tab.id == tabId) {
                        chrome.tabs.create({ url: "https://faktisk.no/metode" }); 
                    }
                }
                

                if(truth == "1" || truth == "2" || truth == "3" || truth == "4" || truth == "5" && hit) {
                    chrome.browserAction.onClicked.addListener(listenerfunc);
                    chrome.browserAction.setIcon({path: 'img/icon_' + truth + '.png', tabId: tabId});
    
                    var truthText = "";
    
                    if(truth == "1") {
                        truthText = "Faktisk helt sant"
                    }
    
                    else if(truth == "2") {
                        truthText = "Faktisk delvis sant"
                    }
    
                    else if(truth == "3") {
                        truthText = "Faktisk ikke sikkert"
                    }
    
                    else if(truth == "4") {
                        truthText = "Faktisk delvis feil"
                    }
    
                    else if(truth == "5") {
                        truthText = "Faktisk helt feil"
                    }
    
                    var notification = new Notification(truthText,{
                        icon: 'http://www.frittord.no/images/uploads/faktisk.png',
                        body: truthText = "Påstand: " + result[num].title + "\n(Klikk for å se konklusjon hos faktisk.no)",
                        requireInteraction: false,
                      });

                      notification.onclick = function () {
                        window.open(result[num].faktisk_url);  
                      };

                      setTimeout(notification.close.bind(notification), 15000);

                      prevNotificationUrl = result[num].faktisk_url;
                      console.log(prevNotificationUrl);
                      
                }
            },
            error:function (xhr, ajaxOptions, thrownError){
                
            }
        });
    }
    
});




