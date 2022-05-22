var issueContainerEl = document.querySelector("#issues-container");

var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc:";

    fetch(apiUrl).then(function(response) {
        //if request was successful:
        if(response.ok) {
            response.json().then(function(data) {
                //pass response data to DOM function
                displayIssues(data);
            });
        }
        else {
            alert("There was a problem with your request!");
        }
    });
}

var displayIssues = function(issues) {
    //make sure there are issues or else return
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    //loop through the issues
    for (var i = 0; i < issues.length; i++) {
        //create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        //this gives it the link to the issue
        issueEl.setAttribute("href", issues[i].html_url);
        //this opens the tab in a new page
        issueEl.setAttribute("target", "_blank");

        //create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to container
        issueEl.appendChild(titleEl);

        //create a type elemnt
        var typeEl = document.createElement("span");

        //check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        
        //append to containers
        issueEl.appendChild(typeEl);
        issueContainerEl.appendChild(issueEl);

    }


}

getRepoIssues("facebook/react");