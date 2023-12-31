const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');

//middlewares here

app.use(cors())
app.use(express.json())
require('dotenv').config()



app.get('/',(req,res)=>{
	res.send('Labyrinth gaming server is running, testing...')
})





//MongoDB application code


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c32luun.mongodb.net/?retryWrites=true&w=majority`;

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
    client.connect();
    
    const userCollection = client.db('usersDB').collection('users')
    const toyCollection = client.db('toysDB').collection('toys')

//to delete a single toy info
    app.delete('/toys/:id', async(req,res)=>{
	const id = req.params.id
	const query = {_id: new ObjectId(id)}
	const result = await toyCollection.deleteOne(query)
	res.send(result)

    })



//to update single toy info
    app.put('/toys/:id', async(req,res)=>{
	const id = req.params.id
	const updatedToy = req.body
	const filter = {_id: new ObjectId(id)}
	const options = {upsert: true}
	const updatedInfo = {
		$set:{
			toyprice: updatedToy.toyprice,
			quantity: updatedToy.quantity,
			description: updatedToy.description
		}
	}
	const result = await toyCollection.updateOne(filter, updatedInfo, options)
	res.send(result)
    })




//to read all users info
    app.get('/users', async(req,res)=>{
	let query = {}
	if (req.query?.email){
		query = {email: req.query.email}
	}
	const result = await userCollection.find(query).toArray()
	res.send(result)
	console.log(result)
    })
   

//to read all toys info
   app.get('/toys', async(req,res)=>{
	let query = {}
	let sortquery = {}
	console.log(req.query)
	if (req.query?.email){
		query = {selleremail: req.query.email}
	}
	if(req.query?.ascended){
		sortquery={'toyprice':1}
	}
	if(req.query?.descended){
		sortquery={'toyprice':-1}
	}
	
	const result = await toyCollection.find(query).sort(sortquery).toArray()
	res.send(result)
    })


//to read single toy info    
   app.get('/toys/:id', async(req,res)=>{
	const id = req.params.id
	const query = {_id: new ObjectId(id)}
	const result = await toyCollection.find(query).toArray()
	res.send(result)
    })
    



//to add new user, create user info
    app.post('/users', async(req,res)=>{
	const newUser = req.body
	const result = await userCollection.insertOne(newUser)
	res.send(result)
	console.log(newUser)
    })

//to add new toy, create toy info
    app.post('/toys', async(req,res)=>{
	const newToy = req.body
	const result = await toyCollection.insertOne(newToy)
	res.send(result)
	console.log(newToy)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  //  await client.close();
  }
}
run().catch(console.dir);









console.log(uri)



app.listen(port, ()=>{
	console.log(`Labyrinth gaming server is running on port: ${port}`)
})
