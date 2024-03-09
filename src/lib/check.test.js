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
		// console.log(foundCompanyData)
		expect(foundCompanyData).toBeDefined();
	});

	test("companies in medverkande length is equal to companies in classroom length", () => {
		expect(foundMedverkande.split(",").length).toEqual(foundCompaniesInClassrooms.split(",").length);
  });
  
  test("companies in main info length is equal to companies in classroom length", () => {
		expect(foundCompanyData.length).toEqual(foundCompaniesInClassrooms.split(",").length);
	});
  
  describe("Test if company inside classroom is found in medverkande", async () => {
		test.each(foundCompaniesInClassrooms.split(",").sort())("%s is found in medverkande", (company) => {
			expect(foundMedverkande.includes(company)).toBeTruthy();
		});
	});

	describe("Test if company inside medverkande is found in a classroom", async () => {
		test.each(foundMedverkande.split(","))("%s is found in a classroom", (company) => {
			expect(foundCompaniesInClassrooms.includes(company)).toBeTruthy();
		});
	});

	describe("Test if company inside main info is found in a classroom", async () => {
		test.each(foundCompanyData)(
			"name in info for $companyName is found in classroom",
			(company) => {
				expect(foundCompaniesInClassrooms.includes(company["companyName"].toString())).toBeTruthy();
			}
		);
	});

	describe("Test if company inside main info is found in a medverkande", async () => {
		test.each(foundCompanyData)(
			"name in info for $companyName is found in medverkande",
			(company) => {
				expect(foundMedverkande.includes(company["companyName"].toString())).toBeTruthy();
			}
		);
	});
});
