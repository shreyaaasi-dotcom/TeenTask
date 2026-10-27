

// Page elements
const roleSelection = document.getElementById("roleSelection");
const loginSection = document.getElementById("loginSection");

const loginView = document.getElementById("loginView");
const signupView = document.getElementById("signupView");

const loginTitle = document.getElementById("loginTitle");
const loginDescription = document.getElementById("loginDescription");
const signupDescription = document.getElementById("signupDescription");

const backButton = document.getElementById("backButton");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const signupLink = document.getElementById("signupLink");
const loginLink = document.getElementById("loginLink");

const loginMessage = document.getElementById("loginMessage");
const signupMessage = document.getElementById("signupMessage");

let selectedRole = "";


// Load demo accounts saved in this browser
function getAccounts() {
    try {
        return JSON.parse(
            localStorage.getItem("teenTaskAccounts") || "[]"
        );
    } catch {
        return [];
    }
}

// acc
function saveAccounts(accounts) {
    localStorage.setItem(
        "teenTaskAccounts",
        JSON.stringify(accounts)
    );
}


if (roleSelection) {
    document.querySelectorAll(".role-option").forEach(button => {
        button.addEventListener("click", () => {
            selectedRole = button.dataset.role;

            roleSelection.hidden = true;
            loginSection.hidden = false;

            loginView.hidden = false;
            signupView.hidden = true;

            loginForm.reset();
            signupForm.reset();

            loginMessage.textContent = "";
            signupMessage.textContent = "";

            if (selectedRole === "teen") {
                loginTitle.textContent = "Teen Login";
                loginDescription.textContent =
                    "Log in to explore jobs and manage your applications.";

                signupDescription.textContent =
                    "Create an account to explore available jobs.";
            } else {
                loginTitle.textContent = "Job Poster Login";
                loginDescription.textContent =
                    "Log in to post jobs and manage your listings.";

                signupDescription.textContent =
                    "Create an account to post and manage jobs.";
            }
        });
    });
}

// Return to role selection
if (backButton) {
    backButton.addEventListener("click", () => {
        loginSection.hidden = true;
        roleSelection.hidden = false;

        loginForm.reset();
        signupForm.reset();

        loginMessage.textContent = "";
        signupMessage.textContent = "";

        selectedRole = "";
    });
}

// Switch to sign-up view
if (signupLink) {
    signupLink.addEventListener("click", event => {
        event.preventDefault();

        loginView.hidden = true;
        signupView.hidden = false;

        loginMessage.textContent = "";
        signupMessage.textContent = "";
        signupForm.reset();
    });
}

// Switch back to login view
if (loginLink) {
    loginLink.addEventListener("click", event => {
        event.preventDefault();

        signupView.hidden = true;
        loginView.hidden = false;

        loginMessage.textContent = "";
        signupMessage.textContent = "";
        loginForm.reset();
    });
}

// Create an account
if (signupForm) {
    signupForm.addEventListener("submit", event => {
        event.preventDefault();

        const username = document
            .getElementById("newUsername")
            .value.trim();

        const password = document
            .getElementById("newPassword")
            .value;

        const confirmPassword = document
            .getElementById("confirmPassword")
            .value;

        signupMessage.style.color = "#c0392b";

        if (!selectedRole) {
            signupMessage.textContent =
                "Please choose your account type first.";
            return;
        }

        if (password !== confirmPassword) {
            signupMessage.textContent =
                "Your passwords don't match.";
            return;
        }

        const accounts = getAccounts();

        // Usernames are unique regardless of account type
        const usernameExists = accounts.some(account =>
            account.username.toLowerCase() === username.toLowerCase()
        );

        if (usernameExists) {
            signupMessage.textContent =
                "That username is already taken.";
            return;
        }

        // save
        accounts.push({
            username: username,
            password: password,
            role: selectedRole
        });

        try {
            saveAccounts(accounts);
        } catch {
            signupMessage.textContent =
                "Could not save the account in this browser.";
            return;
        }

        signupMessage.style.color = "#247447";
        signupMessage.textContent =
            "Account created! You can now log in.";

        
        signupForm.reset();

        document.getElementById("username").value = username;
        document.getElementById("password").value = "";

        setTimeout(() => {
            signupView.hidden = true;
            loginView.hidden = false;
            loginMessage.textContent =
                "Account created. Please log in.";
            loginMessage.style.color = "#247447";
        }, 700);
    });
}

// Log in
if (loginForm) {
    loginForm.addEventListener("submit", event => {
        event.preventDefault();

        const username = document
            .getElementById("username")
            .value.trim();

        const password = document
            .getElementById("password")
            .value;

        const accounts = getAccounts();

        const account = accounts.find(account =>
            account.username.toLowerCase() === username.toLowerCase() &&
            account.password === password &&
            account.role === selectedRole
        );

        if (!account) {
            loginMessage.style.color = "#c0392b";
            loginMessage.textContent =
                "Incorrect username or password for this account type.";
            return;
        }

        // Save the logged-in user's session for this demo
localStorage.setItem("teenTaskCurrentUser", JSON.stringify({
    username: account.username,
    role: account.role
}));

// Redirect based on the account's saved role
if (account.role === "teen") {
    window.location.href = "explore.html";
} else if (account.role === "adult") {
    window.location.href = "post.html";
}
    });
}



// TEENTASK — JOB POSTING


const postContent = document.getElementById("postContent");
const accessDenied = document.getElementById("accessDenied");
const jobForm = document.getElementById("jobForm");
const jobType = document.getElementById("jobType");
const otherJobGroup = document.getElementById("otherJobGroup");
const otherJob = document.getElementById("otherJob");
const postMessage = document.getElementById("postMessage");
const successPanel = document.getElementById("successPanel");
const newJobButton = document.getElementById("newJobButton");

// chreck loggedin user's role
if (postContent && accessDenied) {
    let currentUser = null;

    try {
        currentUser = JSON.parse(
            localStorage.getItem("teenTaskCurrentUser")
        );
    } catch {
        currentUser = null;
    }

    if (currentUser && currentUser.role === "adult") {
        postContent.hidden = false;
        accessDenied.hidden = true;
    } else {
        postContent.hidden = true;
        accessDenied.hidden = false;
    }
}


if (jobType && otherJobGroup && otherJob) {
    jobType.addEventListener("change", () => {
        const isOther = jobType.value === "Other";

        otherJobGroup.hidden = !isOther;
        otherJob.required = isOther;

        if (!isOther) {
            otherJob.value = "";
        }
    });
}

//  job listings saved in this browser
function getTeenTaskJobs() {
    try {
        return JSON.parse(
            localStorage.getItem("teenTaskJobs") || "[]"
        );
    } catch {
        return [];
    }
}

// Save job listings for the demo
function saveTeenTaskJobs(jobs) {
    localStorage.setItem(
        "teenTaskJobs",
        JSON.stringify(jobs)
    );
}

// Publish a job
if (jobForm) {
    jobForm.addEventListener("submit", event => {
        event.preventDefault();

        postMessage.textContent = "";
        postMessage.style.color = "#c0392b";

        // Recheck the role before publishing
        let currentUser = null;

        try {
            currentUser = JSON.parse(
                localStorage.getItem("teenTaskCurrentUser")
            );
        } catch {
            currentUser = null;
        }

        if (!currentUser || currentUser.role !== "adult") {
            postMessage.textContent =
                "Only job-poster accounts can publish listings.";
            return;
        }

        const date = document.getElementById("jobDate").value;
        const start = document.getElementById("startTime").value;
        const end = document.getElementById("endTime").value;

        if (date < new Date().toLocaleDateString("en-CA")) {
            postMessage.textContent =
                "Please choose today or a future date.";
            return;
        }

        if (end <= start) {
            postMessage.textContent =
                "The end time must be after the start time.";
            return;
        }

        const selectedType = jobType.value;

        const finalJobType = selectedType === "Other"
            ? otherJob.value.trim()
            : selectedType;

        if (!finalJobType) {
            postMessage.textContent =
                "Please describe the type of job.";
            return;
        }

        const job = {
            id: crypto.randomUUID(),
            posterUsername: currentUser.username,
            type: finalJobType,
            description: document
                .getElementById("jobDescription").value.trim(),
            payPerHour: Number(
                document.getElementById("pay").value
            ),
            date: date,
            startTime: start,
            endTime: end,

          
            address: document
                .getElementById("jobAddress").value.trim(),

            accepted: false,
            acceptedBy: null
        };

        const jobs = getTeenTaskJobs();
        jobs.push(job);

        try {
            saveTeenTaskJobs(jobs);
        } catch {
            postMessage.textContent =
                "Unable to save this listing in your browser.";
            return;
        }

        jobForm.hidden = true;
        successPanel.hidden = false;
    });
}

// Allow the poster to create another listing
if (newJobButton) {
    newJobButton.addEventListener("click", () => {
        jobForm.reset();
        jobForm.hidden = false;
        successPanel.hidden = true;
        postMessage.textContent = "";

        otherJobGroup.hidden = true;
        otherJob.required = false;
    });
}


// TEENTASK — EXPLORE JOBS


const jobListings = document.getElementById("jobListings");
const categoryFilter = document.getElementById("categoryFilter");
const jobCount = document.getElementById("jobCount");
const emptyJobs = document.getElementById("emptyJobs");
const exploreMessage = document.getElementById("exploreMessage");

// Only run this on the Explore Jobs page
if (jobListings && categoryFilter) {

    function readJobs() {
        try {
            const jobs = JSON.parse(
                localStorage.getItem("teenTaskJobs") || "[]"
            );

            return Array.isArray(jobs) ? jobs : [];
        } catch {
            return [];
        }
    }

    function getCurrentUser() {
        try {
            return JSON.parse(
                localStorage.getItem("teenTaskCurrentUser")
            );
        } catch {
            return null;
        }
    }

    function renderJobs() {
        const allJobs = readJobs();

        const selectedCategory = categoryFilter.value;

        const visibleJobs = allJobs.filter(job => {
            // Do not show jobs that have already been accepted.
            if (job.accepted) return false;

            if (
                selectedCategory === "Other" &&
                !["Babysitting", "Senior Assistance", "Lawn Mowing"]
                    .includes(job.type)
            ) {
                return true;
            }

            return selectedCategory === "all" ||
                job.type === selectedCategory;
        });

        jobListings.replaceChildren();

        jobCount.textContent =
            `${visibleJobs.length} ${visibleJobs.length === 1 ? "job" : "jobs"} available`;

        emptyJobs.hidden = visibleJobs.length !== 0;

        const currentUser = getCurrentUser();

        visibleJobs.forEach(job => {
            const card = document.createElement("article");
            card.className = "job-listing";

            const category = document.createElement("span");
            category.className = "job-category-label";
            category.textContent = job.type;

            const title = document.createElement("h3");
            title.textContent = job.type;

            const description = document.createElement("p");
            description.className = "job-description";
            description.textContent = job.description;

            const pay = document.createElement("p");
            pay.className = "job-pay";
            pay.textContent =
                `$${Number(job.payPerHour).toFixed(2)} / hour`;

            const meta = document.createElement("div");
            meta.className = "job-meta";

            const date = document.createElement("span");
            date.textContent = `Date: ${job.date}`;

            const time = document.createElement("span");
            time.textContent =
                `Time: ${job.startTime}–${job.endTime}`;

            const location = document.createElement("span");
            location.textContent = "Street address shared only after acceptance";

            meta.append(date, time, location);

            const acceptButton = document.createElement("button");
            acceptButton.type = "button";
            acceptButton.textContent = "Accept Job";

            // Only teen accounts can accept jobs.
            if (!currentUser || currentUser.role !== "teen") {
                acceptButton.textContent = "Log in as a Teen to Accept";
            }

            acceptButton.addEventListener("click", () => {
                const user = getCurrentUser();

                if (!user || user.role !== "teen") {
                    exploreMessage.textContent =
                        "Please log in with a teen account before accepting a job.";
                    return;
                }

                const latestJobs = readJobs();
                const latestJob = latestJobs.find(item =>
                    item.id === job.id
                );

                if (!latestJob || latestJob.accepted) {
                    exploreMessage.textContent =
                        "This job is no longer available.";
                    renderJobs();
                    return;
                }

                // mark the job as accepted
                latestJob.accepted = true;
                latestJob.acceptedBy = user.username;

                try {
                    localStorage.setItem(
                        "teenTaskJobs",
                        JSON.stringify(latestJobs)
                    );
                } catch {
                    exploreMessage.textContent =
                        "Unable to accept this job in the browser.";
                    return;
                }
                exploreMessage.textContent =
                    "Job accepted in this demo. Address sharing requires a secure backend.";

                renderJobs();
            });

            card.append(
                category,
                title,
                description,
                pay,
                meta,
                acceptButton
            );

            jobListings.appendChild(card);
        });
    }

    categoryFilter.addEventListener("change", renderJobs);

    renderJobs();
}


/* MY PROFILE PAGE */

const profileForm = document.getElementById("profileForm");

if (profileForm) {
    const currentUser = JSON.parse(
        localStorage.getItem("teenTaskCurrentUser") || "null"
    );

    const message = document.getElementById("profileMessage");

    if (!currentUser) {
        window.location.href = "login.html";
    } else if (currentUser.role !== "teen") {
        document.querySelector(".profile-container").innerHTML = `
            <h1>Teen profiles only</h1>
            <p>This page is for teen task seekers.</p>
            <a href="post.html">Return to Post a Job</a>
        `;
    } else {
        const profiles = JSON.parse(
            localStorage.getItem("teenTaskProfiles") || "{}"
        );

        const savedProfile = profiles[currentUser.username] || {
            displayName: currentUser.username,
            bio: "",
            skills: "",
            experience: "",
            awards: ""
        };

        document.getElementById("profileUsername").textContent =
            savedProfile.displayName || currentUser.username;

        document.getElementById("profileAvatar").textContent =
            (savedProfile.displayName || currentUser.username)
                .charAt(0).toUpperCase();

        document.getElementById("displayName").value =
            savedProfile.displayName || "";

        document.getElementById("bio").value = savedProfile.bio || "";
        document.getElementById("skills").value = savedProfile.skills || "";
        document.getElementById("experience").value =
            savedProfile.experience || "";
        document.getElementById("awards").value = savedProfile.awards || "";

        document.getElementById("displayName").addEventListener("input", event => {
            document.getElementById("profileUsername").textContent =
                event.target.value || currentUser.username;

            document.getElementById("profileAvatar").textContent =
                (event.target.value || currentUser.username)
                    .charAt(0).toUpperCase();
        });

        profileForm.addEventListener("submit", event => {
            event.preventDefault();

            const updatedProfiles = JSON.parse(
                localStorage.getItem("teenTaskProfiles") || "{}"
            );

            updatedProfiles[currentUser.username] = {
                displayName: document.getElementById("displayName").value.trim(),
                bio: document.getElementById("bio").value.trim(),
                skills: document.getElementById("skills").value.trim(),
                experience: document.getElementById("experience").value.trim(),
                awards: document.getElementById("awards").value.trim()
            };

            localStorage.setItem(
                "teenTaskProfiles",
                JSON.stringify(updatedProfiles)
            );

            message.textContent = "Your profile has been saved!";
        });
    }
}


/* MY JOBS DASHBOARD */

(() => {
    const root = document.getElementById("myJobsRoot");
    if (!root) return;

    const currentUser = JSON.parse(
        localStorage.getItem("teenTaskCurrentUser") || "null"
    );

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    const isTeen = currentUser.role === "teen";
    const availableSection = document.getElementById("availableSection");
    const availableList = document.getElementById("availableJobs");
    const myJobsList = document.getElementById("myJobsList");
    const message = document.getElementById("myJobsMessage");

    document.getElementById("dashboardDescription").textContent = isTeen
        ? "Explore current offers and track the jobs you've accepted."
        : "Manage your offers and see which jobs have been accepted.";

    document.getElementById("myJobsTitle").textContent = isTeen
        ? "My Accepted Jobs"
        : "My Posted Jobs";

    availableSection.hidden = !isTeen;

    function readJobs() {
        return JSON.parse(localStorage.getItem("teenTaskJobs") || "[]");
    }

    function saveJobs(jobs) {
        localStorage.setItem("teenTaskJobs", JSON.stringify(jobs));
    }

    function readProfiles() {
        return JSON.parse(localStorage.getItem("teenTaskProfiles") || "{}");
    }

    function safe(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    function statusFor(job) {
        if (job.completed) {
            return '<span class="job-status completed">Completed</span>';
        }

        if (job.completionRequested) {
            return '<span class="job-status waiting">Awaiting confirmation</span>';
        }

        if (job.accepted) {
            return '<span class="job-status">Accepted</span>';
        }

        return '<span class="job-status">Available</span>';
    }

    function formatDate(date) {
        if (!date) return "Not specified";

        // Parse a YYYY-MM-DD date as a local date to avoid timezone shifts.
        const parts = date.split("-").map(Number);
        if (parts.length !== 3 || parts.some(Number.isNaN)) return safe(date);

        const parsed = new Date(parts[0], parts[1] - 1, parts[2]);
        return parsed.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    }

    function jobDetails(job) {
        return `
            <p class="job-pay">$${safe(job.payPerHour)} / hour</p>
            <p><strong>Date:</strong> ${safe(formatDate(job.date))}</p>
            <p><strong>Time:</strong> ${safe(job.startTime || "Not specified")}
                – ${safe(job.endTime || "Not specified")}</p>
            <p>${safe(job.description || "No description provided.")}</p>
        `;
    }

    function addressDetails(job) {
        return `
            <div class="job-detail">
                <p><strong>Job address</strong></p>
                <p>${safe(job.address || "No address provided.")}</p>
            </div>
        `;
    }

    function seekerProfile(job) {
        if (!job.acceptedBy) return "";

        const profile = readProfiles()[job.acceptedBy];

        return `
            <div class="seeker-profile">
                <h4>Accepted by: ${safe(profile?.displayName || job.acceptedBy)}</h4>
                <p><strong>Username:</strong> ${safe(job.acceptedBy)}</p>
                <p><strong>About:</strong> ${safe(profile?.bio || "No introduction added yet.")}</p>
                <p><strong>Skills:</strong> ${safe(profile?.skills || "No skills listed yet.")}</p>
                <p><strong>Experience:</strong> ${safe(profile?.experience || "No experience listed yet.")}</p>
                <p><strong>Awards / certifications:</strong> ${safe(profile?.awards || "None listed.")}</p>
            </div>
        `;
    }

    function renderAvailable(jobs) {
        const offers = jobs.filter(job =>
            !job.accepted && !job.completed &&
            job.posterUsername !== currentUser.username
        );

        document.getElementById("availableCount").textContent =
            `${offers.length} offer${offers.length === 1 ? "" : "s"}`;

        document.getElementById("noAvailableJobs").hidden = offers.length > 0;

        availableList.innerHTML = offers.map(job => `
            <article class="my-job-card">
                ${statusFor(job)}
                <h3>${safe(job.type || "Other Job")}</h3>
                ${jobDetails(job)}
                <p><strong>Posted by:</strong> ${safe(job.posterUsername || "Employer")}</p>
                <p><strong>Address:</strong> Shared after acceptance</p>
                <button class="my-job-button" data-action="accept"
                    data-job-id="${safe(job.id)}">
                    Accept Job
                </button>
            </article>
        `).join("");
    }

    function renderMyJobs(jobs) {
        const mine = isTeen
            ? jobs.filter(job => job.acceptedBy === currentUser.username)
            : jobs.filter(job => job.posterUsername === currentUser.username);

        document.getElementById("myJobsCount").textContent =
            `${mine.length} job${mine.length === 1 ? "" : "s"}`;

        document.getElementById("noMyJobs").hidden = mine.length > 0;

        document.getElementById("noMyJobs").textContent = isTeen
            ? "You haven't accepted any jobs yet. Check Current Offers above."
            : "You haven't posted any jobs yet.";

        myJobsList.innerHTML = mine.map(job => {
            let action = "";

            if (isTeen && job.accepted && !job.completionRequested && !job.completed) {
                action = `
                    <button class="my-job-button" data-action="finish"
                        data-job-id="${safe(job.id)}">
                        Mark Work as Finished
                    </button>
                `;
            }

            if (!isTeen && job.completionRequested && !job.completed) {
                action = `
                    <button class="my-job-button" data-action="complete"
                        data-job-id="${safe(job.id)}">
                        Confirm Completion
                    </button>
                `;
            }

            if (job.completed) {
                action = `
                    <button class="my-job-button secondary" disabled>
                        Job Completed
                    </button>
                `;
            } else if (job.completionRequested && isTeen) {
                action = `
                    <p class="job-detail">You've marked this job as finished.
                    Waiting for the employer to confirm.</p>
                `;
            }

            return `
                <article class="my-job-card">
                    ${statusFor(job)}
                    <h3>${safe(job.type || "Other Job")}</h3>
                    ${jobDetails(job)}
                    <p><strong>${isTeen ? "Employer" : "Posted by"}:</strong>
                        ${safe(job.posterUsername || "Not specified")}</p>
                    ${addressDetails(job)}
                    ${isTeen ? "" : seekerProfile(job)}
                    ${action}
                </article>
            `;
        }).join("");
    }

    function render() {
        const jobs = readJobs();
        if (isTeen) renderAvailable(jobs);
        renderMyJobs(jobs);
    }

    function updateJob(jobId, action) {
        const jobs = readJobs();
        const job = jobs.find(item => item.id === jobId);

        if (!job) {
            message.textContent = "This job could not be found. Refresh the page.";
            return;
        }

        if (action === "accept") {
            if (!isTeen || job.accepted || job.completed ||
                job.posterUsername === currentUser.username) {
                message.textContent = "This job is no longer available.";
                render();
                return;
            }

            job.accepted = true;
            job.acceptedBy = currentUser.username;
            job.completionRequested = false;
            job.completed = false;
            message.textContent = "Job accepted. It now appears in My Accepted Jobs.";
        }

        if (action === "finish") {
            if (!isTeen || job.acceptedBy !== currentUser.username ||
                !job.accepted || job.completed) {
                message.textContent = "You can't update this job.";
                render();
                return;
            }

            job.completionRequested = true;
            message.textContent = "Marked as finished. The employer can now confirm.";
        }

        if (action === "complete") {
            if (isTeen || job.posterUsername !== currentUser.username ||
                !job.completionRequested || job.completed) {
                message.textContent = "You can't confirm this job.";
                render();
                return;
            }

            job.completed = true;
            message.textContent = "Completion confirmed.";
        }

        saveJobs(jobs);
        render();
    }

    root.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        updateJob(button.dataset.jobId, button.dataset.action);
    });

    render();
})();
