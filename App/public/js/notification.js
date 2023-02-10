let notification_icon = document.getElementById("notification-icon");

function handleNotificationMenu() {
    let menu = document.getElementById("notification-menu");

    if (menu.classList.contains("hidden")) {
        menu.classList.remove("hidden");
    }
    else {
        menu.classList.add("hidden");
    }
}

notification_icon.onclick = handleNotificationMenu;
