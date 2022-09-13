var mat = new Uint16Array(1024);

function xytolen(x,y){
  return x+y*32;
}

function lentox(len){
  return len%32;
}
function lentoy(len){
  return Math.floor(len/32);
}


function load(){
    //mat[xytolen(8,16)]=-1;
    mat[xytolen(7,16)]=-1;
    mat[xytolen(23,16)]=-1;
    
    //mat[xytolen(14,14)]=254;
    //mat[xytolen(16,14)]=254;
    //mat[xytolen(14,16)]=254;
  

  //alert(mat);
}

k = 1;
function map(arr, f){
  var arr2 = new Array(arr.length);
  for (i=0;i<arr.length;i++)
    arr2=f(arr[i]);
}
diffvalues = [0,0,0,0,0,0,0,0,0];

function updateCell(x,y){
  var myvalue = mat[xytolen(x,y)];
  var it = 0;
  for (it=0;it<=9;it++){
    diffvalues[it]=0;
  }
  it=0;
  for (var i=x-1;i<=x+1;i+=1){
    for (var j=y-1;j<=y+1;j+=1){
      var diffvalue = (i>31 || i<0 || j>31 || j<0) ? 0 : myvalue - mat[xytolen(i,j)];
      diffvalues[it]=Math.max(0,diffvalue);
      it++;
    }
  }
  var S = 0;
  for (it=0;it<=9;it++){
    S+=diffvalues[it];
  }
  it = 0;
  var selected=-1;
/*
  for (var i=x-1;i<=x+1;i+=1){
    for (var j=y-1;j<=y+1;j+=1){
      //if (i>31 || i<0 || j>31 || j<0) continue;
      if (myvalue>=diffvalues[it]){ //&& Math.random()<=diffvalues[it]/S){
        var v=diffvalues[it];
        mat[xytolen(x,y)]-=v //1*diffvalues[it]/S;
        myvalue-=v;
        mat[xytolen(i,j)]+=v;
      }
      it++;
    }
  }
*/
for (var i=x-1;i<=x+1;i+=1){
    for (var j=y-1;j<=y+1;j+=1){
      var v=Math.floor(diffvalues[it]/8);
      if (myvalue>=v && Math.random()<=diffvalues[it]/S){
        //selected=it;
        //o selecionado recebe floor(diffvalue/2)
        mat[xytolen(x,y)]-=v
        mat[xytolen(i,j)]+=v;
        break;
      }
      it++;
    }
  }

}

function update(){
  for (var i=0;i<32;i+=1){
  for (var j=0;j<32;j+=1){
    updateCell(i,j);
  }
  }
}

function drawCell(x,y){
//alert(x+' '+y);
  var len=xytolen(x,y);
  var value=mat[len];
  //var grayscale=(((65535-value)/256)&0xff).toString(16);
 var grayscale=((255-Math.min(255, value))&0xff).toString(16);
 grayscale = (grayscale.length==1) ? '0'+grayscale : grayscale;
//var grayscale=(13&0xff).toString(16);
  var col = '#' + grayscale + grayscale + grayscale;
//  if (value != 0) alert(col);
  myctx.fillStyle = col;
  myctx.fillRect(x*32, y*32, 32, 32);
  myctx.fillStyle = '#FF0000';
//  myctx.fillText(value, x*32, (y+1)*32);
}

function draw(){
  myctx.clearRect(0,0,1024,1024);
  for (var i=0;i<32;i+=1){
  for (var j=0;j<32;j+=1){
    drawCell(i,j);
  }
  }
}

load();
setInterval(function(){ update(); draw(); }, 100);
