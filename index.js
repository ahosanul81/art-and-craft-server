const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jhmpwvf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const craftItemCollection = client.db("craftItemDB").collection("craftItem");
    const UpComing = client.db("craftItemDB").collection("upComingItem");
    const ScholarsCollection = client.db("craftItemDB").collection("scholarsCollection");
    // read added craft item
    app.get('/craft_items', async (req, res) => {
      const cursor = craftItemCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // read by specific email
    app.get('/craft_items', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = craftItemCollection.find(query)
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/craft_items/:email', async(req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const result =await craftItemCollection.find(query).toArray();
      res.send(result)
    })

    // read upcoming item 
    app.get('/up_coming_item', async(req, res)=>{
      const cursor = UpComing.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // read scholars
    app.get('/our_scholars', async(req, res)=>{
      const cursor = ScholarsCollection.find()
      const result = await cursor.toArray()
      console.log(result);
      res.send(result)
    })
    // read specific id's craft item
   
    app.get('/craft_item_detail/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await craftItemCollection.findOne(query)
      res.send(result)
    })

    app.get('/update_craft_item/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await craftItemCollection.findOne(query)
      res.send(result)
    })

    // read based on subcategory embroidery
    app.get('/category_based_item/:categoryArt', async(req, res) => {
      const categoryArt = req.params.categoryArt;
      const query = { subCategoryName: categoryArt }
      const result =await craftItemCollection.find(query).toArray();
      res.send(result)
    })

    // read based on customization
    app.get('/my_art_and_craft/customization/:customization', async(req, res) => {
      const customization = req.params.customization;
      console.log(customization, 'paici');
      const query = { customization: customization }
      const result = await craftItemCollection.find(query).toArray();
      console.log(result);
      res.send(result)
    })


    app.delete('/craft_items/:id', async (req, res) => {
      const id = req.params.id
      console.log(id, 'idddd');
      const query = { _id: new ObjectId(id) }
      const result = await craftItemCollection.deleteOne(query)
      res.send(result)
    })

    // update specific id's data
    app.put('/update_craft_item/:id', async (req, res) => {
      const id = req.params.id;
      const craftItem = req.body;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedCraftItem = {
        $set: {
          fullName: craftItem.fullName,
          email: craftItem.email,
          productName: craftItem.productName,
          price: craftItem.price,
          subCategoryName: craftItem.subCategoryName,
          rating: craftItem.rating,
          customization: craftItem.customization,
          imageUrl: craftItem.imageUrl,
          processingTime: craftItem.processingTime,
          stockStatus: craftItem.stockStatus,
          description: craftItem.description
        },
      };
      const result = await craftItemCollection.updateOne(filter, updatedCraftItem, options)
      res.send(result)
    })

    app.post('/craft_items', async (req, res) => {
      const craftItem = req.body;
      const result = await craftItemCollection.insertOne(craftItem);
      res.send(result)
    })


  } finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  console.log('Art and craft server is running');
  res.send('Art and craft server is running')

})
app.listen(port, () => {
  console.log(`Art and craft server is running on port: ${port}`);
})