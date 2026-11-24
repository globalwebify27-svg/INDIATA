import { PrismaClient } from "@prisma/client";
import { SeedLogger } from "../shared/logger";
import { SeedOptions, SeedResult } from "../shared/types";

export async function seedFieldOperations(
  prisma: PrismaClient,
  options?: SeedOptions
): Promise<SeedResult> {
  const logger = new SeedLogger("field-operations", options?.verbose ?? false);
  logger.info("Seeding Field Operations & Ground Polling Booth Infrastructure...");

  try {
    const org = await prisma.organization.findUnique({
      where: { slug: "kasba-peth-2026" },
    });

    if (!org) {
      logger.error("Organization 'kasba-peth-2026' not found. Cannot seed booths.");
      return logger.toResult(false, "Organization missing");
    }

    const booths = [
      {
        boothNumber: "101",
        boothName: "Navbharat High School, Room 1",
        locality: "Kothrud Depot Road",
        partNumber: "Part 101",
        pollingCentre: "Navbharat Education Complex",
        pollingAddress: "Room 1, Ground Floor, Navbharat High School, Kasba Peth, Pune 411030",
        latitude: 18.52043,
        longitude: 73.85674,
        googleMapsUrl: "https://maps.google.com/?q=18.52043,73.85674",
        totalVoters: 1142,
        maleVoters: 602,
        femaleVoters: 540,
        bloName: "Sanjay K. Kulkarni",
        bloPhone: "+91 98220 11234",
        karyakartasCount: 5,
        slipsPercent: 92,
        projectedTurnout: 74.0,
        lastTurnout: 68.4,
      },
      {
        boothNumber: "102",
        boothName: "Navbharat High School, Room 2",
        locality: "Kothrud Depot Road",
        partNumber: "Part 102",
        pollingCentre: "Navbharat Education Complex",
        pollingAddress: "Room 2, First Floor, Navbharat High School, Kasba Peth, Pune 411030",
        latitude: 18.52055,
        longitude: 73.85685,
        googleMapsUrl: "https://maps.google.com/?q=18.52055,73.85685",
        totalVoters: 1205,
        maleVoters: 630,
        femaleVoters: 575,
        bloName: "Asha V. More",
        bloPhone: "+91 98220 54321",
        karyakartasCount: 4,
        slipsPercent: 88,
        projectedTurnout: 71.5,
        lastTurnout: 65.2,
      },
      {
        boothNumber: "103",
        boothName: "Saraswati Vidyalaya, Room 3",
        locality: "Shaniwar Peth",
        partNumber: "Part 103",
        pollingCentre: "Saraswati Education Society",
        pollingAddress: "Room 3, Saraswati Vidyalaya, Shaniwar Peth, Pune 411030",
        latitude: 18.5195,
        longitude: 73.8542,
        googleMapsUrl: "https://maps.google.com/?q=18.5195,73.8542",
        totalVoters: 980,
        maleVoters: 510,
        femaleVoters: 470,
        bloName: "Ramesh P. Joshi",
        bloPhone: "+91 98220 22334",
        karyakartasCount: 3,
        slipsPercent: 78,
        projectedTurnout: 69.0,
        lastTurnout: 62.0,
      },
      {
        boothNumber: "104",
        boothName: "Saraswati Vidyalaya, Room 4",
        locality: "Shaniwar Peth",
        partNumber: "Part 104",
        pollingCentre: "Saraswati Education Society",
        pollingAddress: "Room 4, Saraswati Vidyalaya, Shaniwar Peth, Pune 411030",
        latitude: 18.5196,
        longitude: 73.8543,
        googleMapsUrl: "https://maps.google.com/?q=18.5196,73.8543",
        totalVoters: 1050,
        maleVoters: 550,
        femaleVoters: 500,
        bloName: "Pramila G. Shinde",
        bloPhone: "+91 98220 33445",
        karyakartasCount: 4,
        slipsPercent: 85,
        projectedTurnout: 72.0,
        lastTurnout: 67.5,
      },
      {
        boothNumber: "105",
        boothName: "Kasba Ganpati High School, Hall A",
        locality: "Kasba Peth Gaothan",
        partNumber: "Part 105",
        pollingCentre: "Kasba Samiti Trust School",
        pollingAddress: "Main Hall, Kasba Ganpati High School, Kasba Peth, Pune 411011",
        latitude: 18.5221,
        longitude: 73.8579,
        googleMapsUrl: "https://maps.google.com/?q=18.5221,73.8579",
        totalVoters: 1310,
        maleVoters: 690,
        femaleVoters: 620,
        bloName: "Anil R. Pawar",
        bloPhone: "+91 98220 44556",
        karyakartasCount: 6,
        slipsPercent: 95,
        projectedTurnout: 78.5,
        lastTurnout: 73.1,
      },
      {
        boothNumber: "106",
        boothName: "Shri Shivaji Maratha High School, Room 5",
        locality: "Sadashiv Peth",
        partNumber: "Part 106",
        pollingCentre: "Shri Shivaji Maratha Sanstha",
        pollingAddress: "Room 5, Sadashiv Peth, Pune 411030",
        latitude: 18.5142,
        longitude: 73.8512,
        googleMapsUrl: "https://maps.google.com/?q=18.5142,73.8512",
        totalVoters: 1120,
        maleVoters: 590,
        femaleVoters: 530,
        bloName: "Sunanda M. Thorat",
        bloPhone: "+91 98220 55667",
        karyakartasCount: 4,
        slipsPercent: 82,
        projectedTurnout: 68.0,
        lastTurnout: 64.0,
      },
      {
        boothNumber: "107",
        boothName: "Navin Marathi Shala, Shanipar",
        locality: "Shanipar Chowk",
        partNumber: "Part 107",
        pollingCentre: "Shikshan Prasarak Mandali",
        pollingAddress: "Room 1, Navin Marathi Shala, Shanipar, Pune 411030",
        latitude: 18.5165,
        longitude: 73.8535,
        googleMapsUrl: "https://maps.google.com/?q=18.5165,73.8535",
        totalVoters: 1250,
        maleVoters: 660,
        femaleVoters: 590,
        bloName: "Mahesh T. Kale",
        bloPhone: "+91 98220 66778",
        karyakartasCount: 5,
        slipsPercent: 90,
        projectedTurnout: 75.0,
        lastTurnout: 70.0,
      },
      {
        boothNumber: "108",
        boothName: "Garware Commerce College, Hall 1",
        locality: "Erandwane",
        partNumber: "Part 108",
        pollingCentre: "MES Garware Campus",
        pollingAddress: "Ground Floor, Garware Commerce College, Karve Road, Pune 411004",
        latitude: 18.5115,
        longitude: 73.8324,
        googleMapsUrl: "https://maps.google.com/?q=18.5115,73.8324",
        totalVoters: 1180,
        maleVoters: 610,
        femaleVoters: 570,
        bloName: "Vidya S. Date",
        bloPhone: "+91 98220 77889",
        karyakartasCount: 4,
        slipsPercent: 84,
        projectedTurnout: 70.5,
        lastTurnout: 66.8,
      },
    ];

    for (const b of booths) {
      const existing = await prisma.pollingBooth.findUnique({
        where: {
          organizationId_boothNumber: {
            organizationId: org.id,
            boothNumber: b.boothNumber,
          },
        },
      });

      if (!existing) {
        await prisma.pollingBooth.create({
          data: {
            ...b,
            organizationId: org.id,
          },
        });
        logger.recordInserted("PollingBooth", `Booth #${b.boothNumber} - ${b.boothName}`);
      } else {
        logger.recordSkipped(
          "PollingBooth",
          `Booth #${b.boothNumber}`,
          "Booth already exists in organization"
        );
      }
    }

    logger.info("✓ Field operations polling booth seeder completed.");
    logger.printSummary();
    return logger.toResult(true);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error("Field Operations seeder encountered a failure", error);
    logger.printSummary();
    return logger.toResult(false, errMsg);
  }
}
