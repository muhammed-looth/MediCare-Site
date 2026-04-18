import Department from "../models/Department.js";

export async function getDepartments(_req, res, next) {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json({ success: true, data: departments });
  } catch (error) {
    next(error);
  }
}

export async function getDepartmentById(req, res, next) {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.status(404);
      throw new Error("Department not found.");
    }

    res.json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
}

export async function createDepartment(req, res, next) {
  try {
    const { name, slug, description = "", isActive = true } = req.body;

    if (!name || !slug) {
      res.status(400);
      throw new Error("Name and slug are required.");
    }

    const existing = await Department.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      res.status(409);
      throw new Error("A department with this name or slug already exists.");
    }

    const department = await Department.create({
      name,
      slug,
      description,
      isActive,
    });

    res.status(201).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
}

export async function updateDepartment(req, res, next) {
  try {
    const { id } = req.params;
    const { name, slug, description, isActive } = req.body;

    const department = await Department.findById(id);
    if (!department) {
      res.status(404);
      throw new Error("Department not found.");
    }

    if (name) department.name = name;
    if (slug) department.slug = slug;
    if (description !== undefined) department.description = description;
    if (isActive !== undefined) department.isActive = isActive;

    const updated = await department.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteDepartment(req, res, next) {
  try {
    const { id } = req.params;

    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      res.status(404);
      throw new Error("Department not found.");
    }

    res.json({ success: true, message: "Department deleted successfully." });
  } catch (error) {
    next(error);
  }
}
