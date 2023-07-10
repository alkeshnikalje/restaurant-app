const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());

function oderIndex(arr,id){
    for(let i = 0; i < arr.length;i++){
        if(arr[i].orderId === id){
            return i
        }
    }
    return -1
}
function oderExits(arr,order){
    for(let i = 0; i < arr.length;i++){
        if(arr[i].order === order){
            return true
        }
    }
    return false
}

app.post('/rest/orders',(req,res)=>{
    fs.readFile('resdata.json','utf8',(err,data)=>{
        if(err){
            return res.status(403).send('err occured')
        }
        const orders = JSON.parse(data);
        const exists = oderExits(orders,req.body.order);
        if(!exists){
            const obj = {
                order : req.body.order,
                price : req.body.price,
                orderId : orders.length+1
            }
            orders.push(obj);
            fs.writeFile('resdata.json',JSON.stringify(orders),(err)=>{
                if(err){
                    return res.sendStatus(403)
                }
                return res.json(obj);
            })
        }else{
            return res.status(403).send('order already added');
        }
    })
});

app.get('/rest/orders',(req,res)=>{
    fs.readFile('resdata.json','utf-8',(err,data)=>{
        if(err){
            return res.sendStatus(404)
        }
        const orders = JSON.parse(data);
        return res.json({orders: orders});
    })
});

app.delete('/rest/orders/:orderId',(req,res)=>{
    fs.readFile('resdata.json','utf-8',(err,data)=>{
        if(err){
            return res.sendStatus(403)
        }
        const orders = JSON.parse(data);
        const index = oderIndex(orders,parseInt(req.params.orderId));
        if(index !== -1){
            orders.splice(index,1);
            fs.writeFile('resdata.json',JSON.stringify(orders),(err)=>{
                if(err){
                    return res.sendStatus(403);
                }
                res.json({message: "order deleted successfully"});
            })
        }
    })
});





app.listen(3000,()=>{
    console.log('listening to 3000');
});