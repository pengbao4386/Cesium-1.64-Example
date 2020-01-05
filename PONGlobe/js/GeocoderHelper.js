function GeocoderHelper() {
    let geocoder = viewer.geocoder.viewModel;

    function cancelGeocode(viewModel) {
        viewModel._isSearchInProgress = false;
        if (Cesium.defined(viewModel._geocodeInProgress)) {
            viewModel._geocodeInProgress.cancel = true;
            viewModel._geocodeInProgress = undefined;
        }
    }
    function updateCamera(viewModel, destination) {
        viewModel._scene.camera.flyTo({
            destination : destination,
            complete: function() {
                viewModel._complete.raiseEvent();
            },
            duration : viewModel._flightDuration,
            endTransform : Cesium.Matrix4.IDENTITY
        });
    }
    function geocode(viewModel) {
        var query = viewModel.searchText;
        if (/^\s*$/.test(query)) {
            //whitespace string
            return;
        }
        var height = 800.0;
        // If the user entered (longitude, latitude, [height]) in degrees/meters,
        // fly without calling the geocoder.
        var splitQuery = query.match(/[^\s,\n]+/g);
        if ((splitQuery.length === 2) || (splitQuery.length === 3)) {
            var longitude = +splitQuery[0];
            var latitude = +splitQuery[1];
            var obj = GPS.gcj_decrypt_exact(latitude,longitude);

            if (!isNaN(longitude) && !isNaN(latitude) && !isNaN(height)) {
                updateCamera(viewModel, Cesium.Cartesian3.fromDegrees(obj.lon,obj.lat, height));
                return;
            }
        }
        viewModel._isSearchInProgress = true;

        //天地图请求： http://api.tianditu.gov.cn/geocoder?ds={"keyWord":"延庆区北京市延庆区延庆镇莲花池村前街50夕阳红养老院"}&tk=您的密钥
        //{"msg":"ok","location":{"level":"地产小区","lon":"117.23608","lat":"31.83107"},"searchVersion":"4.8.0","status":"0"}
        let requestString = 'http://api.tianditu.gov.cn/geocoder?ds={keyWord:"' + viewModel._searchText + '"}&tk=42af27c1dd11a95b8b020068bf62a7f0';
        let options = {
            url : requestString
        };

        var promise = Cesium.Resource.fetchJson(options);

        var geocodeInProgress = viewModel._geocodeInProgress = Cesium.when(promise, function(result) {
            if (geocodeInProgress.cancel) {
                return;
            }
            viewModel._isSearchInProgress = false;
            if (result.length === 0 || result.totalHints === 0) {
                viewModel.searchText = viewModel._searchText + ' (not found)';
                return;
            }
            if(Cesium.defined(viewModel.entities)){
                for(var i=0;i<viewModel.entities.length;i++)
                {
                    viewer.entities.remove(viewModel.entities[i]);
                }
            }
            viewModel.entities = [];
            var obj;
            // for(var i=0;i<result.poiInfos.length;i++)
            // {
                var resource = result;
                viewModel._searchText = resource.location.keyWord;
                // var location = resource.location;
                obj = resource.location;
                var entity = {
                    id:obj.keyWord + new Date(),
                    position : Cesium.Cartesian3.fromDegrees(obj.lon,obj.lat),
                    point : {
                        show : true, // default
                        color : Cesium.Color.SKYBLUE, // default: WHITE
                        pixelSize : 10, // default: 1
                        outlineColor : Cesium.Color.YELLOW, // default: BLACK
                        outlineWidth : 3 // default: 0
                    }
                };
                entity.description = new Cesium.ConstantProperty(resource.name);
                viewModel.entities.push(entity);
                // viewer.entities.add(entity);
            // }
            updateCamera(viewModel, Cesium.Cartesian3.fromDegrees(obj.lon,obj.lat, height));
        }, function() {
            if (geocodeInProgress.cancel) {
                return;
            }
            viewModel._isSearchInProgress = false;
            viewModel.searchText = viewModel._searchText + ' (error)';
        });
    }
    geocoder._searchCommand = Cesium.createCommand(function() {
        if (geocoder.isSearchInProgress) {
            cancelGeocode(geocoder);
        } else {
            geocode(geocoder);
        }
    });
}



    // /**
    //  * 原型方法：通过 prototype 添加方法
    //  */
    // let geocode = function(viewModelTiandi) {

    //     //天地图请求： http://api.tianditu.gov.cn/geocoder?ds={"keyWord":"延庆区北京市延庆区延庆镇莲花池村前街50夕阳红养老院"}&tk=您的密钥
    //     //{"msg":"ok","location":{"level":"地产小区","lon":"117.23608","lat":"31.83107"},"searchVersion":"4.8.0","status":"0"}
    //     let requestString = 'http://api.tianditu.gov.cn/geocoder?ds={keyWord:"' + viewModelTiandi._searchText + '"}&tk=42af27c1dd11a95b8b020068bf62a7f0';
    //     let options = {
    //         url : requestString
    //     }

    //     return Cesium.Resource.fetchJson(options) //请求url获取json数据
    //         .then(function(results) {
    //             console.log(viewModelTiandi);
    //             //添加viewModelTiandi.entities
    //             viewModelTiandi.entities = [];
    //             let entity = {
    //                 id: results.location.level,
    //                 position: Cesium.Cartesian3.fromDegrees(results.location.lon, results.location.lat),
    //                 point: {
    //                     show: true,
    //                     color: Cesium.Color.SKYBLUE,
    //                     pixelSize: 10,
    //                     outlineColor: Cesium.Color.YELLOW,
    //                     outlineWidth: 3
    //                 },
    //                 description: new Cesium.ConstantProperty(viewModelTiandi._searchText)
    //             };
    //             viewModelTiandi.entities.push(entity);
    //             viewer.entities.add(entity);
    //         });
    // };
    // //重写_searchCommand
    // geocoder._searchCommand = Cesium.createCommand(function() {
    //     if (geocoder.isSearchInProgress) {
    //         cancelGeocode(geocoder);
    //     } else {
    //         geocode(geocoder);
    //     }
    // });

// }
