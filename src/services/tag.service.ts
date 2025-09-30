import prisma from "@/db/prisma";
import { prismaSafe } from "@/lib/prismaSafe";

class TagServices {
  async getAllTags() {
    try {
      const [error, result] = await prismaSafe(prisma.tag.findMany());

      if (error) {
        return { success: false, error: error };
      }

      if (!result) {
        return { success: false, error: "Failed to fetch tags" };
      }

      return { success: true, data: result };
    } catch (error) {
      console.log(`Failed to fetch tags, ${error}`);
      return { success: false, error: error };
    }
  }

  async createTag(name: string) {
    try {
      const [error, result] = await prismaSafe(
        prisma.tag.create({
          data: {
            name,
          },
        })
      );
      if (error) {
        return { success: false, error: error };
      }
      if (!result) {
        return { success: false, error: "Failed to create tag" };
      }
      return { success: true, data: result };
    } catch (error) {
      console.log(`Failed to create tag, ${error}`);
      return { success: false, error: error };
    }
  }

  async checkTagExists(id: string) {
    try {
      const [error, result] = await prismaSafe(
        prisma.tag.findUnique({
          where: {
            id,
          },
        })
      );
      if (error) {
        return { success: false, error: error };
      }
      if (!result) {
        return { success: false, error: "Tag does not exist" };
      }
      return { success: true, data: result };
    } catch (error) {
      console.log(`Failed to check tag existence, ${error}`);
      return { success: false, error: error };
    }
  }

  async getTagById(id: string) {
    try {
      const [error, result] = await prismaSafe(
        prisma.tag.findUnique({
          where: {
            id,
          },
        })
      );
      if (error) {
        return { success: false, error: error };
      }
      if (!result) {
        return { success: false, error: "Tag not found" };
      }
      return { success: true, data: result };
    } catch (error) {
      console.log(`Failed to fetch tag by id, ${error}`);
      return { success: false, error: error };
    }
  }

  async updateTag(id: string, name: string) {
    try {
      const [error, result] = await prismaSafe(
        prisma.tag.update({
          where: {
            id,
          },
          data: {
            name,
          },
        })
      );
      if (error) {
        return { success: false, error: error };
      }
      if (!result) {
        return { success: false, error: "Failed to update tag" };
      }
      return { success: true, data: result };
    } catch (error) {
      console.log(`Failed to update tag, ${error}`);
      return { success: false, error: error };
    }
  }

  async deleteTag(id: string) {
    try {
      const [error, result] = await prismaSafe(
        prisma.tag.delete({
          where: {
            id,
          },
        })
      );
      if (error) {
        return { success: false, error: error };
      }
      if (!result) {
        return { success: false, error: "Failed to delete tag" };
      }
      return { success: true, data: result };
    } catch (error) {
      console.log(`Failed to delete tag, ${error}`);
      return { success: false, error: error };
    }
  }

  async associateTagToProject(projectId: string, tagIds: string[]) {
    try {
      const [tagError, tagResult] = await prismaSafe(
        prisma.projectTags.createMany({
          data: tagIds.map((tagId) => ({ projectId, tagId })),
          skipDuplicates: true,
        })
      );

      if (tagError) {
        console.log(`Error associating tag ${tagIds} with project ${projectId}: ${tagError}`);
        return { success: false, error: "Failed to associate tags with project" };
      }
      if (!tagResult) {
        console.log(`No result when associating tag ${tagIds} with project ${projectId}`);
        return { success: false, error: "Failed to associate tags with project" };
      }

      return { success: true, data: tagResult };
    } catch (error) {
      console.log(`Failed to associate tags with project ${projectId}, ${error}`);
      return { success: false, error: "Internal server error" };
    }
  }

  async updateProjectTags(tx, projectId: string, tagIds: string[]) {
    try {
      const validTagIds: string[] = [];
      for (const tagId of tagIds) {
        const isTagExists = await tagServices.checkTagExists(tagId);
        if (!isTagExists.success) {
          throw new Error(`Tag with id ${tagId} does not exist`);
        }
        // Only add valid tag IDs
        validTagIds.push(tagId);
      }

      const currentProjectTags = await tx.projectTags.findMany({ where: { projectId } });
      const currentProjectTagIds = currentProjectTags.map((t) => t.tagId);

      // Add only tags that are in request but not in DB
      // Tags that are in both should be left as is
      const tagsToAdd = validTagIds.filter((id) => !currentProjectTagIds.includes(id));

      // Remove only tags that are in DB but not in request
      const tagsToRemove = currentProjectTagIds.filter((id) => !validTagIds.includes(id));

      if (tagsToAdd.length > 0) {
        await tx.projectTags.createMany({
          data: tagsToAdd.map((tagId) => ({ projectId, tagId })),
          skipDuplicates: true,
        });
      }

      if (tagsToRemove.length > 0) {
        await tx.projectTags.deleteMany({
          where: { projectId, tagId: { in: tagsToRemove } },
        });
      }

      return { success: true, data: null };
    } catch (error) {
      console.log(`Failed to update project tags for project ${projectId}, ${error}`);
      return { success: false, error: "Internal server error" };
    }
  }
}

export const tagServices = new TagServices();
