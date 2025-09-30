import type { Request, Response } from "express";
import { tagServices } from "@/services/tag.service";
import { ErrorResponse, SuccessResponse } from "@/dtos";
import { HTTP } from "@/utils/constants";

class TagController {
  async getAllTags(req: Request, res: Response) {
    try {
      const tagResults = await tagServices.getAllTags();

      if (!tagResults.success) {
        return res.status(HTTP.BAD_REQUEST).json(ErrorResponse(HTTP.BAD_REQUEST, tagResults.error));
      }

      return res
        .status(HTTP.OK)
        .json(SuccessResponse(HTTP.OK, "Tags fetched successfully", tagResults.data));
    } catch (error) {
      console.log(`Get All Tags Controller Error: ${error}`);
      return res
        .status(HTTP.INTERNAL)
        .json(ErrorResponse(HTTP.INTERNAL, (error as Error).message || "Internal Server Error"));
    }
  }

  async createTag(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const createTagResult = await tagServices.createTag(name);

      if (!createTagResult.success) {
        return res
          .status(HTTP.BAD_REQUEST)
          .json(ErrorResponse(HTTP.BAD_REQUEST, createTagResult.error));
      }

      return res
        .status(HTTP.OK)
        .json(SuccessResponse(HTTP.OK, "Tag created successfully", createTagResult.data));
    } catch (error) {
      console.log(`Create Tag Controller Error: ${error}`);
      return res
        .status(HTTP.INTERNAL)
        .json(ErrorResponse(HTTP.INTERNAL, (error as Error).message || "Internal Server Error"));
    }
  }

  async getTagById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tagResult = await tagServices.getTagById(id);

      if (!tagResult.success) {
        return res.status(HTTP.NOT_FOUND).json(ErrorResponse(HTTP.NOT_FOUND, tagResult.error));
      }

      return res
        .status(HTTP.OK)
        .json(SuccessResponse(HTTP.OK, "Tag fetched successfully", tagResult.data));
    } catch (error) {
      console.log(`Get Tag By Id Controller Error: ${error}`);
      return res
        .status(HTTP.INTERNAL)
        .json(ErrorResponse(HTTP.INTERNAL, (error as Error).message || "Internal Server Error"));
    }
  }

  async updateTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updateTagResult = await tagServices.updateTag(id, name);

      if (!updateTagResult.success) {
        return res
          .status(HTTP.BAD_REQUEST)
          .json(ErrorResponse(HTTP.BAD_REQUEST, updateTagResult.error));
      }

      return res
        .status(HTTP.OK)
        .json(SuccessResponse(HTTP.OK, "Tag updated successfully", updateTagResult.data));
    } catch (error) {
      console.log(`Update Tag Controller Error: ${error}`);
      return res
        .status(HTTP.INTERNAL)
        .json(ErrorResponse(HTTP.INTERNAL, (error as Error).message || "Internal Server Error"));
    }
  }

  async deleteTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleteTagResult = await tagServices.deleteTag(id);

      if (!deleteTagResult.success) {
        return res
          .status(HTTP.BAD_REQUEST)
          .json(ErrorResponse(HTTP.BAD_REQUEST, deleteTagResult.error));
      }

      return res
        .status(HTTP.OK)
        .json(SuccessResponse(HTTP.OK, "Tag deleted successfully", deleteTagResult.data));
    } catch (error) {
      console.log(`Delete Tag Controller Error: ${error}`);
      return res
        .status(HTTP.INTERNAL)
        .json(ErrorResponse(HTTP.INTERNAL, (error as Error).message || "Internal Server Error"));
    }
  }
}

export const tagController = new TagController();
