
### Sandbox setup
Create a DNS record for this host:
```
127.0.0.1.   sandbox.helloweather.cloud
```

For OSX you typically edit the file under: /etc/hosts to do that.

Then in your terminal run the file sandbox.sh, that will start a tiny static PHP server. 

When you sandbox is running you will see something like this:
![image](https://user-images.githubusercontent.com/1669319/126537446-eaa3b182-014b-4d45-98a4-203c7bd9ec65.png)

### Deployment
At the moment only Daniel Aranda could do deployments, he uses AWS S3 sync to his CDN

### Testing
Code was made using ES6 classes so is very easy and straight forward to add unit, integration and functional tests. 

Jasmine BDD tests will be add soon.


### Licenses

You can't use the weather icons, that was bought by me for this specific open source project only, please read licenses here:
https://www.vectorstock.com/royalty-free-vector/modern-realistic-weather-icons-set-meteorology-vector-20994038


Background image by:
https://www.vexels.com/vectors/preview/70352/green-blurry-nature-background-with-bokeh-bubbles
