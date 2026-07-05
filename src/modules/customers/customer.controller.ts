import { Request, Response } from 'express';
import { Customer } from './customer.model';

// POST /api/customers
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    const existing = await Customer.findOne({ phone });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A customer with this phone number already exists' });
    }

    const customer = await Customer.create({ name, phone, email, address });
    return res.status(201).json({ success: true, message: 'Customer created successfully', data: customer });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/customers
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const customers = await Customer.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Customer.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: customers,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/customers/:id
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    return res.status(200).json({ success: true, data: customer });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/customers/:id
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, address } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, address },
      { new: true, runValidators: true }
    );
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    return res.status(200).json({ success: true, message: 'Customer updated successfully', data: customer });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/customers/:id
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    return res.status(200).json({ success: true, message: 'Customer deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
