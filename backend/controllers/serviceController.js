import Service from "../models/Service.js";

export async function getServices(_req, res, next) {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
}

export async function getServiceById(req, res, next) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error("Service not found.");
    }

    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
}

export async function createService(req, res, next) {
  try {
    const { name, shortDescription, about, imageUrl = "", price = 0, availability = "Available" } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Service name is required.");
    }

    const service = await Service.create({
      name,
      shortDescription,
      about,
      imageUrl,
      price,
      availability,
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
}

export async function updateService(req, res, next) {
  try {
    const { id } = req.params;
    const { name, shortDescription, about, imageUrl, price, availability } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      res.status(404);
      throw new Error("Service not found.");
    }

    if (name) service.name = name;
    if (shortDescription) service.shortDescription = shortDescription;
    if (about) service.about = about;
    if (imageUrl) service.imageUrl = imageUrl;
    if (price !== undefined) service.price = price;
    if (availability) service.availability = availability;

    const updated = await service.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteService(req, res, next) {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      res.status(404);
      throw new Error("Service not found.");
    }

    res.json({ success: true, message: "Service deleted successfully." });
  } catch (error) {
    next(error);
  }
}
