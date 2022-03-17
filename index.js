import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();


const app = express();
const PORT = 8080;

app.use(express.json())
app.use(cors())

app.listen(
	PORT,
	() => console.log(`it's alive on http://localhost:${PORT}`)
)

/**
 * This endpoint will fetch imageURIs with the given tag (category),
 * how many images of the category, and what size the images should be.
 * 
 * ? Sizes can be found here: https://www.flickr.com/services/api/misc.urls.html
 * 
 * *params: req, res
 */
app.get('/search-image/:tag/:amount/:page', async (req, res) => {
	const { tag, amount, page } = req.params;
	var url = `https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=${process.env.FLICKR_API_KEY}&tags=${tag}&per_page=${amount}&page=${page}&format=json&nojsoncallback=1`
	fetch(url)
		.then((response) => {
			return response.json()
		})
		.then((jsonRes) => {
			let imgArray = jsonRes.photos.photo.map((img) => {
				var imgURI = `https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}`
				return {
					title: img.title,
					imgURI: imgURI
				}
			})
			res.status(200).send(imgArray)
		}).catch((error) => {
			console.log(error)
			res.status(400).send(error)
		})
})