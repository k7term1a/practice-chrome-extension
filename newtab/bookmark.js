chrome.bookmarks.getTree(
    bookmarks => {
        console.log(bookmarks);
        bookmarks[0].children.forEach((b) => {
            console.log(b.title)
            b.children.forEach((c) => {
                console.log(c.title);
            });

        });
    }
)