const Task = require("../../models/task.model");
const mongoose = require("mongoose");

class Tasks {
  async createTask(req, res) {
    try {
      const task = new Task({
        ...req.body,
        owner: req.user._id,
      });
      await task.save();

      res.status(201).send({
        message: "Task created successfully",
        success: true,
        data: task,
      });
    } catch (error) {
      res.status(400).send({
        message: "Task not created",
        success: false,
        error,
      });
    }
  }

  async getTasks(req, res) {
    const match = {};
    const sort = { createdAt: -1 };
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * limit;

    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }

    if (req.query.sortBy) {
      sort.createdAt = req.query.sortBy === "desc" ? -1 : 1;
    }

    try {
      const ownerId = mongoose.Types.ObjectId(req.user._id);
      // const tasks = await Task.find({ owner: { $in: [ownerId] } }).populate('owner', ['name', 'email', 'age'])
      const tasks = await Task.aggregate([
        {
          $match: {
            ...match,
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
        // {
        //   $project: {
        //     description: 1,
        //     completed: 1,
        //     owner: {
        //       name: 1,
        //       age: 1,
        //     },
        //   },
        // },
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

  async getTask(req, res) {
    const _id = req.params.id;
    try {
      const task = await Task.findOne({ _id, owner: req.user._id });

      if (!task) {
        return res.status(404).send({
          message: "Task not found",
          error: true,
          success: false,
        });
      }

      res.status(200).send({
        message: "Task fetched successfully",
        success: true,
        data: task,
      });
    } catch (error) {
      res.status(500).send({
        message: "Task not fetched",
        success: false,
        error,
      });
    }
  }

  async updateTask(req, res) {
    const _id = req.params.id;
    if (!_id) {
      return res.status(404).send({
        error: "Invalid updates!",
        success: false,
      });
    }

    const updates = Object.keys(req.body);
    const allowedUpdateArray = ["description", "completed"];
    const isValidOperation = updates.every((update) => allowedUpdateArray.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({
        error: "Invalid updates!",
        success: false,
      });
    }

    try {
      const task = await Task.findOneAndUpdate({ _id, owner: req.user._id }, req.body, {
        new: true,
        runValidators: true,
      });

      if (!task) {
        return res.status(404).send({
          message: "Task not found",
          success: false,
        });
      }

      res.status(200).send({
        message: "Task updated successfully",
        success: true,
        data: task,
      });
    } catch (error) {
      res.status(400).send({
        message: "Task not updated",
        success: false,
        error,
      });
    }
  }

  async deleteTask(req, res) {
    const _id = req.params.id;
    try {
      const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

      if (!task) {
        return res.status(404).send({
          message: "Task not found",
          success: false,
        });
      }

      res.status(200).send({
        message: "Task deleted successfully",
        success: true,
        data: task,
      });
    } catch (error) {
      res.status(500).send({
        message: "Task not deleted",
        success: false,
        error,
      });
    }
  }
}

module.exports = new Tasks();
