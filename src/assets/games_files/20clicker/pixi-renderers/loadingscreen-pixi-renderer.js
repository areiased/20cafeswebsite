gdjs.LoadingScreenPixiRenderer = function(runtimeGamePixiRenderer)
{
    
	
	this._pixiRenderer = runtimeGamePixiRenderer.getPIXIRenderer();
    this._loadingScreen = new PIXI.Container();
    this._text = new PIXI.Text(" 20Cafés/dia ", {font: "bold 60px Arial", fill: "#FFFFFF", align: "center"});
	this._logo = new PIXI.Sprite.fromImage('../desktop-icon-256.png') 
	
    this._loadingScreen.addChild(this._text);
	this._loadingScreen.addChild(this._logo);
    this._text.position.y = this._pixiRenderer.height/2;
	this._logo.position.y = this._pixiRenderer.height/2-120;
    
}

gdjs.LoadingScreenRenderer = gdjs.LoadingScreenPixiRenderer; //Register the class to let the engine use it.


gdjs.LoadingScreenPixiRenderer.prototype.render = function(percent) {
    
	this._logo.position.x = this._pixiRenderer.width/2 - this._text.width/2-90;
	this._text.text = percent + "%";
    this._text.position.x = this._pixiRenderer.width/2 - this._text.width/2;
    this._pixiRenderer.render(this._loadingScreen);
    

  
};