console.log('wooooooo')

var imageContainer = document.getElementById('imageContainer');

function showPostImage(post) {
	console.log(post);
	imageContainer.innerHTML = "<img src='" + post + "'>"
	imageContainer.style.display = 'block';
}

function hidePostImage() {
	console.log('eel')
	imageContainer.style.display = 'none';
}