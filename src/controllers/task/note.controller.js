const Note = require("../../models/note.model");
const mongoose = require("mongoose");

class Notes {
  async createNote(req, res) {
    try {
      const task = new Note({
        ...req.body,
        owner: req.user._id,
      });
      await task.save();

      res.status(201).send({
        message: "Note created successfully",
        success: true,
        data: task,
      });
    } catch (error) {
      res.status(400).send({
        message: "Note not created",
        success: false,
        error,
      });
    }
  }

  async getNotes(req, res) {
    const sort = { createdAt: -1 };
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * limit;

    if (req.query.sortBy) {
      sort.createdAt = req.query.sortBy === "desc" ? -1 : 1;
    }

    try {
      const ownerId = mongoose.Types.ObjectId(req.user._id);
      const tasks = await Note.aggregate([
        {
          $match: {
            owner: ownerId,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  name: 1,
                  email: 1,
                  age: 1,
                },
              },
            ],
            as: "owner",
          },
        },
        { $unwind: "$owner" },
        { $sort: sort },
        {
          $facet: {
            meta: [{ $count: "total" }, { $addFields: { page } }],
            data: [{ $skip: skip }, { $limit: limit }],
          },
        },
      ]);

      if (!tasks) {
        return res.status(200).send({
          message: "Tasks not found",
          data: [],
          success: false,
        });
      }

      res.status(200).send({
        message: "Tasks fetched successfully",
        success: true,
        data: tasks[0].data,
        meta: tasks[0].meta[0],
      });
    } catch (error) {
      res.status(500).send({
        message: "Tasks not fetched",
        success: false,
        error,
      });
    }
  }

  async getNote(req, res) {
    const _id = req.params.id;
    try {
      const note = await Note.findOne({ _id, owner: req.user._id });

      if (!note) {
        return res.status(404).send({
          message: "Note not found",
          error: true,
          success: false,
        });
      }

      res.status(200).send({
        message: "Note fetched successfully",
        success: true,
        data: note,
      });
    } catch (error) {
      res.status(500).send({
        message: "Task not fetched",
        success: false,
        error,
      });
    }
  }

  async updateNote(req, res) {
    const _id = req.params.id;
    if (!_id) {
      return res.status(404).send({
        error: "Invalid updates!",
        success: false,
      });
    }
    const updates = Object.keys(req.body);
    const allowedUpdateArray = ["description", "title", "note"];
    const isValidOperation = updates.every((update) => allowedUpdateArray.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({
        error: "Invalid updates!",
        success: false,
      });
    }

    try {
      const note = await Note.findOneAndUpdate({ _id, owner: req.user._id }, req.body, {
        new: true,
        runValidators: true,
      });

      if (!note) {
        return res.status(404).send({
          message: "Note not found",
          success: false,
        });
      }

      res.status(200).send({
        message: "Note updated successfully",
        success: true,
        data: note,
      });
    } catch (error) {
      res.status(400).send({
        message: "Note not updated",
        success: false,
        error,
      });
    }
  }

  async deleteNote(req, res) {
    const _id = req.params.id;
    try {
      const note = await Note.findOneAndDelete({ _id, owner: req.user._id });

      if (!note) {
        return res.status(404).send({
          message: "Note not found",
          success: false,
        });
      }

      res.status(200).send({
        message: "Note deleted successfully",
        success: true,
        data: note,
      });
    } catch (error) {
      res.status(500).send({
        message: "Note not deleted",
        success: false,
        error,
      });
    }
  }
}

module.exports = new Notes();
