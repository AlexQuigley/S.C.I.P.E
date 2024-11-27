import path from "path";
import fs from "fs";
import { Client, GuildMember } from "discord.js";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  major: string;
  seniority: string;
  class: string;
  email: string;
  discord: string;
}

/**
 * On guild member add, syncs the member's role and nickname with the data.json file.
 * Depends that the data.json file is in the root directory of the project.
 * Depends that role names are already created in the format "Project Name - Current".
 * 
 * @param {Client} client - The Discord client.
 * @param {GuildMember} member - The new guild member.
 * @throws {Error} if an error occurs while syncing the member.
 */
const syncMember = async (client: Client, member: GuildMember) => {
  try {
    // Define the path to the data.json file
    const filePath = path.join(__dirname, "..", "..", "..", "data.json");

    // Read and parse the data.json file
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Extract the student's project name based on the new member's Discord username
    let projectName = null;
    let studentName = null;
    for (const partner of data.partners) {
      for (const project of partner.projects) {
        for (const team of project.teams) {
          const student: Student | undefined = team.students.find(
            (student: Student) => student.discord === member.user.username
          );
          if (student) {
            projectName = project.name;
            studentName = `${student.firstName} ${student.lastName}`;
            break;
          }
        }
        if (projectName) break;
      }
      if (projectName) break;
    }

    if (projectName) {
      // Find the role by name
      const roleName = `${projectName} - Current`;
      const role = member.guild.roles.cache.find((role) => role.name === roleName);

      if (role) {
        // Assign the role to the member
        await member.roles.add(role);
        console.log(`Assigned role ${roleName} to member ${member.user.username}`);
      } 
      else {
        console.log(`Role ${roleName} not found`);
      }

      // Change the member's nickname
      if (studentName) {
        await member.setNickname(studentName);
        console.log(`Changed nickname of ${member.user.username} to ${studentName}`);
      }
    } 
    else {
        console.log(`No matching student found for new member: ${member.user.username}`);
    }
  } catch (error) {
    console.error("Error syncing member:", error);
  }
};

export default syncMember;