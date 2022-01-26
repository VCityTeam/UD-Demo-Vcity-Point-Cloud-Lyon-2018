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

This demo can also be started using this [Docker](https://github.com/VCityTeam/UD-Demo-Vcity-Point-Cloud-Lyon-2018-Docker).

An online example of this demo can be found [here](https://point-cloud.vcityliris.data.alpha.grandlyon.com/)  

### Point Cloud Computation

The pipeline used to create the 3DTiles from Cloud Point is documented [here](https://github.com/VCityTeam/UD-Reproducibility/tree/master/Computations/ComputePointCloudsLyon)

Note: the [generated data set](https://dataset-dl.liris.cnrs.fr/three-d-tiles-lyon-metropolis/2018/2018/Point_Cloud_Lyon_2018) is 3.9Gb, has ~44 000 files in the top level directory and 14 347 sub-directories... )
