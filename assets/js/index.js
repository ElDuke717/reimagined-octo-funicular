/* 
Get all the blog entries and post them to the blog page
*/

// declare blogEntries variable to hold all the blog entries on the server
let blogEntries;

// get all entries and post to the blog page
fetch('http://localhost:3333/entries')
  .then(res => res.json())
  .then(data => {
    console.log('data', data);
    blogEntries = data;
    // loop through the blog entries and post them to the blog page
    blogEntries.forEach( entry => {
      // create a div to hold the blog entry
      const blogEntryDiv = document.createElement('div');
      blogEntryDiv.className = 'blog-entry';
      blogEntryDiv.setAttribute('data-id', entry._id);
            
      // add date info to each entry
      // Add text content to the blogEntryDiv:
      const blogEntryDate = document.createElement('p');
      // convert the date 
      const date = new Date(entry.created_at);
      // set the text content of the date to the date of the entry
      blogEntryDate.textContent = date.toDateString();
      blogEntryDiv.appendChild(blogEntryDate);

      // Add text content to the blogEntryDiv:
      const blogEntryText = document.createElement('p');
      blogEntryText.textContent = entry.content;
      blogEntryDiv.appendChild(blogEntryText);


      // Create a button to delete each entey
      const entryButton = document.createElement('button');
      entryButton.textContent = 'Delete this post';
      entryButton.className = 'delete-button';
      // set the custom attribute of 'data-id' so that it appears when the DOM loads
      entryButton.setAttribute('data-id', entry._id);
      blogEntryDiv.appendChild(entryButton);

      // Append the new blog entry div element to the parent div
      document.querySelector('#blog-feed').appendChild(blogEntryDiv);

    }
    );
  })
  .catch(err => console.error(err));

// Publish a new blog post
const publishButton = document.querySelector('#publish-entry');

// Add blog post when button is pushed
publishButton.addEventListener('click', async ()=> {
  const entry = document.querySelector('#entry').value;
  // post the new entry to the database
  try {
    const response = await fetch('http://localhost:3333/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: entry }),
    });
    // if there's an error, e.g. response is not OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
    // Get the response (if any)
      const data = await response.json();
      // create new div to hold the new blog entry, add to the top of the list
      const blogEntryDiv = document.createElement('div');
      blogEntryDiv.className = `blog-entry ${data.created_at}`;
      // convert the date 
      const date = new Date(data.created_at);
      // set the text content of the date to the date of the entry
      blogEntryDiv.innerHTML = `<p>${date.toDateString()}</p><p>${data.content}</p>`;
      // add classname with created_at date to the blog entry div to help with deletion
      blogEntryDiv.className = `blog-entry ${data.created_at}`;
      const postList = document.querySelector('#blog-feed');
      postList.insertBefore(blogEntryDiv, postList.firstChild);

      // Add delete button to the new blog entry
      const entryButton = document.createElement('button');
      entryButton.textContent = 'Delete this post';
      entryButton.className = 'delete-button';
      // set the custom attribute of 'data-id' so that it appears when the DOM loads
      entryButton.setAttribute('data-id', data._id);
      blogEntryDiv.appendChild(entryButton);
        
      // clear the input field
      document.querySelector('#entry').value = '';
    }
  // catch any errors
  } catch (error) {
    console.error('Error:', error);
  }
});


// Delete a blog post
// Add event listener to the blog feed
// look for all click events in the DOM
document.addEventListener('click', async (event) => {
  // if the DOM event has a class of 'delete-button', assign itemID the property of data-id
  if (event.target.classList.contains('delete-button')) {
    // get the data-id of the clicked element
    const entryId = event.target.getAttribute('data-id');
    // get the data-id of the parent element
    const parentId = event.target.parentElement.getAttribute('data-id');

    // if the entryId is equal to the parentId, then delete the entry
    if (entryId === parentId) { 
      // asynchronous request to database
      try {
      // Send a Delete request to the server - pass in itemId as parameter
        const response = await fetch(`http://localhost:3333/entries/${entryId}`, {
          method: 'DELETE',
        });      
        // if there's an error, e.g. response is not OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
        // If the update is successful, hide the item in the DOM
          event.target.parentElement.style.display = 'none';
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
});