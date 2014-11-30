/*--------------------------------------------------*/
/*  Finds parent element with data-cmd attribute    */ 
/*--------------------------------------------------*/
function findCmdAttribute(element,        cmdAttr, hrefAttr, foundAttr, foundLink, foundTab ) {
	
	foundLink = foundAttr = foundTab = false;

	while(element && element.nodeName && element.getAttribute) {

		//find a foundation type of tab
		if (!foundTab) {
			if (element.hasAttribute("data-tab")) {
				foundTab = element;
			}
		}

		//find data cmds

		if (!foundAttr) {
			cmdAttr = element.getAttribute("data-cmd");

			if (cmdAttr) {

				foundAttr = { cid:cmdAttr, el:element };

			}
		}

		//find links

		if (!foundLink) {

			hrefAttr  = element.getAttribute("href");

			if (hrefAttr) {
			
				foundLink = { href:hrefAttr, el:element };

			}

		}

		element = element.parentNode;

	}

	return {
		cmd : foundAttr,
		link : foundLink,
		tab : foundTab
	}

}
