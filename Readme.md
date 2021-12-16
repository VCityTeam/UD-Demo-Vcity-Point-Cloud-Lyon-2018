## Installing and running this demo

This demo can be locally (on your desktop) started in the following way
```
npm install
npm run debug     
```
and then use your favorite (web) browser to open
`http://localhost:8000/`.

Note that technically the `npm run debug` command will use the [webpack-dev-server npm package](https://github.com/webpack/webpack-dev-server) that
 - runs node application that in turn launched a vanilla http sever in local (on your desktop) 
 - launches a watcher (surveying changes in sources)
 - in case of change that repacks an updated bundle
 - that triggers a client (hot) reload 

## Technical notes concerning the template application
Some modules used by the DemoFull require some server-side components to be installed on
some server (possibly your desktop). For example
 * the 3D objects (buildings) are (by default) serverd by a LIRIS server
   and thus require no specific configuratione there is nothing more to do
 * handling of documents will require you to [install the API_enhanced_city](https://github.com/VCityTeam/UD-Serv/blob/master/API_Enhanced_City/INSTALL.md).
 * you can also modify the [application configuration file](assets/config/config.json)

