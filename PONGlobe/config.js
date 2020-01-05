// 在线天地图影像服务地址(经纬度)
const TDT_IMG_C = 'http://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0'+
'&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&'+
'format=tiles&tk=42af27c1dd11a95b8b020068bf62a7f0';

const TDT_CVA_C = 'http://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0'+
'&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={TileMatrix}&TILEROW={TileRow}'+
'&TILECOL={TileCol}&tk=42af27c1dd11a95b8b020068bf62a7f0'

// 天地图在线影像服务对象
const TDT_IMG_Provider = {
    url: TDT_IMG_C,
    layer: "tdtImg_c",
    style: "default",
    format: "tiles",
    tileMatrixSetID: "c",
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
    tilingScheme: new Cesium.GeographicTilingScheme(),
    tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],
    maximumLevel: 20,
    show: false
};

// 天地图在线中文标注服务对象
const TDT_CVA_Provider = {
    url: TDT_CVA_C,
    layer: "tdtAnnoLayer",
    style: "default",
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible"
};
