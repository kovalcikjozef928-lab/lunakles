const express = require("express");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.static("public"));
app.use(express.json());

app.post("/create-checkout-session", async (req,res)=>{
    const items = req.body.items;
    const line_items = items.map(item => ({
        price_data:{
            currency:"eur",
            product_data:{name:item.name},
            unit_amount:item.price*100
        },
        quantity:1
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:line_items,
        mode:"payment",
        success_url:process.env.SUCCESS_URL,
        cancel_url:process.env.CANCEL_URL
    });

    res.json({id: session.id});
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, ()=>console.log("Server beží na porte " + PORT));