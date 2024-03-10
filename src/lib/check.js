import "dotenv/config";
import puppeteer from "puppeteer";
import { END_INDEX, START_INDEX } from "./constants";

export async function checkClassroomsAndMedverkande() {
	const browser = await puppeteer.launch({ headless: "new" });

	const page = await browser.newPage();

	page.on("console", (message) => {
		if (message.type() === "log") {
			console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`);
		}
	});

	await page.goto(process.env.SCRAPE_TARGET);

	const data = await page.evaluate(() => {
		//* Classrooms

		const classRoomsSelector = ".et_pb_section_2 .et_pb_row_5";
		const allCompaniesInA = `${classRoomsSelector} .et_pb_text_5`;
		const allCompaniesInB = `${classRoomsSelector} .et_pb_text_6`;
		const allCompaniesInC = `${classRoomsSelector} .et_pb_text_7`;
		const allCompaniesInAElement = document.querySelector(allCompaniesInA);
		const allCompaniesInBElement = document.querySelector(allCompaniesInB);
		const allCompaniesInCElement = document.querySelector(allCompaniesInC);

		const A214 = allCompaniesInAElement.querySelectorAll("p")[0].textContent.split("\n").slice(1);
		const A215 = allCompaniesInAElement.querySelectorAll("p")[1].textContent.split("\n").slice(1);
		const A218 = allCompaniesInAElement.querySelectorAll("p")[2].textContent.split("\n").slice(1);

		const B201 = allCompaniesInBElement.querySelectorAll("p")[0].textContent.split("\n").slice(1);
		const B202 = allCompaniesInBElement.querySelectorAll("p")[1].textContent.split("\n").slice(1);
		const B204 = allCompaniesInBElement.querySelectorAll("p")[2].textContent.split("\n").slice(1);
		const B205 = allCompaniesInBElement.querySelectorAll("p")[3].textContent.split("\n").slice(1);

		const C201 = allCompaniesInCElement.querySelectorAll("p")[0].textContent.split("\n").slice(1);
		const C204 = allCompaniesInCElement.querySelectorAll("p")[1].textContent.split("\n").slice(1);
		const C205 = allCompaniesInCElement.querySelectorAll("p")[2].textContent.split("\n").slice(1);
		const C208 = allCompaniesInCElement.querySelectorAll("p")[3].textContent.split("\n").slice(1);

		const foundCompaniesInClassrooms =
			A214 +
			"," +
			A215 +
			"," +
			A218 +
			"," +
			B201 +
			"," +
			B202 +
			"," +
			B204 +
			"," +
			B205 +
			"," +
			C201 +
			"," +
			C204 +
			"," +
			C205 +
			"," +
			C208;

		//* Medverkande

		let medverkandeSelector = "#medverkande > div.et_pb_row.et_pb_row_7.et_pb_row_4col";
		const element = document.querySelector(medverkandeSelector);

		// Process and return the data you need
		const foundMedverkandeElement = element ? element.textContent : null;
		const foundMedverkande = foundMedverkandeElement
			// .toLowerCase()
			.split("\n")
			.map((a) => a.trim())
			.filter((line) => line.length > 0)
			// .map((a) => `\n"${a}"`)
			.join(",");

		// console.log(allCompaniesInClassroomsText)

		return { foundCompaniesInClassrooms, foundMedverkande };
	});

	return data;
}

export async function checkCompanyData() {
	const browser = await puppeteer.launch({ headless: "new" });

	const page = await browser.newPage();

	// page.on("console", (message) => {
	// 	if (message.type() === "log") {
	// 		console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`);
	// 	}
	// });
	await page.goto(process.env.SCRAPE_TARGET);

  // ! hard coded values here, check the constants below to see how to get these numbers
	let start = START_INDEX;
	let end = END_INDEX;
	let foundCompanyData = [];

	for (let i = start; i <= end; i++) {
		const selector = `.et_pb_section_${i}`;
		const loopCompanyData = await page.evaluate((selector) => {
			const element = document.querySelector(selector);
			if (element) {
				const h1 = element.querySelector("h1");
				const h2 = element.querySelector("h2");
				const h3 = element.querySelector("h3");
				// let's just check everything
				const h4 = element.querySelector("h4");
				const h5 = element.querySelector("h5");
				const h6 = element.querySelector("h6");
				let companyName;

				// IBM is h3 for some reason
				if (h2) {
					companyName = h2.textContent.trim();
				} else if (h3) {
					companyName = h3.textContent.trim();
				}
				// FMV, Frank Fam are h1
				else if (h1) {
					companyName = h1.textContent.trim();
				} else if (h4) {
					companyName = h4.textContent.trim();
				} else if (h5) {
					companyName = h5.textContent.trim();
				} else if (h6) {
					companyName = h6.textContent.trim();
				}

				if (!companyName) {
					companyName = `invalid company name ${selector}`;
				}

				const omOss = ["Om oss/att jobba med oss:"];
				const merOmOss = ["Mer om oss:"];
				const interestedIn = ["Vi är intresserade av dig som studerar:"];
				const interests = ["Vi är intresserade av att:"];
				const contact = ["Kontakta mig om du har frågor"];

				const headings = element.querySelectorAll("h4");
				headings.forEach((heading, i) => {
					const sibling = heading.nextElementSibling;

					if (heading.textContent.trim() === "Om oss/att jobba hos oss:") {
						omOss.push(sibling.textContent.trim());
					}
					if (heading.textContent.trim() === "Mer om oss:") {
						const links = sibling.querySelectorAll("a");
						let output = "";
						links.forEach((link) => {
							// console.log(link.innerHTML);
							// console.log(link.href);
							output += `${link.innerHTML} (${link.href})\n`;
						});
						merOmOss.push(output);
					}
					if (heading.textContent.trim() === "Vi är intresserade av dig som studerar:") {
						let content = sibling.textContent.trim();
						const patterns = [
							{
								pattern:
									/Mjukvaruutvecklare, Inbyggda system och IoT \(Internet of Things-utvecklare$/m,
								replacement:
									"Mjukvaruutvecklare, Inbyggda system och IoT (Internet of Things-utvecklare)",
							},
							{
								pattern: /Mjukvaruutvecklare, Inbyggda system och IoT$/m,
								replacement:
									"Mjukvaruutvecklare, Inbyggda system och IoT (Internet of Things-utvecklare)",
							},
							{
								pattern: /Business Intelligence-analytiker$/m,
								replacement: "Business Intelligence – analytiker",
							},
							{
								pattern: /Mjukvaruutvecklare inbyggda system och IOT$/m,
								replacement:
									"Mjukvaruutvecklare, Inbyggda system och IoT (Internet of Things-utvecklare)",
							},
							{
								pattern: /Programutvecklare .NET:$/m,
								replacement: "Programutvecklare .NET",
							},
						];

						patterns.forEach(({ pattern, replacement }) => {
							if (pattern.test(content)) {
								content = content.replace(pattern, replacement);
							}
						});
						interestedIn.push(content);
					}
					if (heading.textContent.trim() === "Vi är intresserade av att:") {
						interests.push(sibling.textContent.trim());
					}
					if (heading.textContent.trim() === "Kontakta mig om du har frågor") {
						const links = sibling.querySelectorAll("a");
						if (links) {
							let text = sibling.textContent.trim();
							// ! makes mailto a bit buggy for now
							links.forEach((link) => {
								if (`mailto:${link.innerText}` !== link.href) {
									text = text.replace(link.innerText, `${link.innerText} (${link.href})`);
								}
							});
							contact.push(text);
						} else {
							contact.push(sibling.textContent.trim());
						}
					}
				});
				return { companyName, omOss, merOmOss, interestedIn, interests, contact };
			}
		}, selector);
		foundCompanyData.push(loopCompanyData);
	}
	return foundCompanyData;
}

// const result = await checkCompanyData();
// console.log(result)
