// sum.test.js
import { expect, it, test, describe } from "vitest";
import { checkClassroomsAndMedverkande, checkCompanyData } from "./check";

describe("Info checker", async () => {
	const classroomsMedverkandeResult = await checkClassroomsAndMedverkande();
	const foundCompaniesInClassrooms = classroomsMedverkandeResult.foundCompaniesInClassrooms;
	const foundMedverkande = classroomsMedverkandeResult.foundMedverkande;
	const foundCompanyData = await checkCompanyData();

	it("finds companies", () => {
		expect(foundCompaniesInClassrooms).toBeDefined();
	});

	it("finds medverkande", () => {
		expect(foundMedverkande).toBeDefined();
	});

	it("finds company data", () => {
		expect(foundCompanyData).toBeDefined();
	});

	test("companies in medverkande length is equal to companies in classroom length", () => {
		expect(foundMedverkande.split(",").length).toEqual(
			foundCompaniesInClassrooms.split(",").length
		);
	});

	test("companies in main info length is equal to companies in classroom length", () => {
		expect(foundCompanyData.length).toEqual(foundCompaniesInClassrooms.split(",").length);
	});

	describe("Test if classroom name equals name in medverkande", async () => {
		test.each(foundCompaniesInClassrooms.split(",").sort())(
			"%s (classroom) name is equal to name in medverkande",
			(classroomCompany) => {
				let found = false;
				foundMedverkande.split(",").forEach((medverkandeCompany) => {
					if (medverkandeCompany === classroomCompany) {
						found = true;
					}
				});
				expect(found).toBeTruthy();
			}
		);
	});

	describe("Test if medverkande name equals name in classroom", async () => {
		test.each(foundMedverkande.split(","))(
			"%s (medverkande) name is equal to name in medverkande",
			(medverkandeCompany) => {
				let found = false;
				foundCompaniesInClassrooms.split(",").forEach((classroomCompany) => {
					if (medverkandeCompany === classroomCompany) {
						found = true;
					}
				});
				expect(found).toBeTruthy();
			}
		);
	});

	describe("Test if company info name equals name in classroom", async () => {
		test.each(foundCompanyData)(
			"name in info for $companyName is found in classroom",
			(companyInfo) => {
				let found = false;
				let currentCompany = companyInfo["companyName"];
				foundCompaniesInClassrooms.split(",").forEach((classroomCompany) => {
					if (companyInfo["companyName"] === classroomCompany) {
						found = true;
					}
				});
				expect(found).toBeTruthy();
			}
		);
	});

	describe("Test if company info name equals name in medverkande", async () => {
		test.each(foundCompanyData)(
			"name in info for $companyName is found in medverkande",
			(companyInfo) => {
				let found = false;
				foundMedverkande.split(",").forEach((medverkandeCompany) => {
					if (companyInfo["companyName"] === medverkandeCompany) {
						found = true;
					}
				});
				expect(found).toBeTruthy();
			}
		);
	});
});
