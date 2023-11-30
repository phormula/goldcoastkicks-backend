import { Request, Response, NextFunction } from 'express'
import User from '@model/User'
import OrderService from '@app/services/Order.service'

class OrderController {
  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.getAllOrders(req.user as User, req.query)

      return res.send(result)
    } catch (err) {
      return next(err)
    }
  }

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.getOrder(req.params.id)
      if (order.status === 'error') {
        return res.status(404).send(order)
      }

      return res.status(200).send(order)
    } catch (err) {
      return next(err)
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.createOrder(req.body, req.user as User)

      return res.status(201).json(order)
    } catch (err) {
      next(err)
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as User
      await OrderService.createOrderHistory(req.params.id, user)
      const updateOrder = await OrderService.updateOrder(req.params.id, req.body, user)

      return res.status(200).json(updateOrder)
    } catch (error) {
      return next(error)
    }
  }

  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.deleteOrder(req.params.id)
      const statusCode = order.data.status === 'error' ? 500 : 200

      return res.status(statusCode).json(order)
    } catch (err) {
      next(err)
    }
  }

  async orderStatus(_req: Request, res: Response, next: NextFunction) {
    try {
      const orderStatus = await OrderService.orderStatus()

      return res.status(200).send(orderStatus)
    } catch (err) {
      return next(err)
    }
  }

  async getOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const orderStatus = await OrderService.getOrderStatus(req.params.id)

      return res.status(200).send(orderStatus)
    } catch (err) {
      return next(err)
    }
  }

  async createOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const orderStatus = await OrderService.createOrderStatus(req.body)

      return res.status(200).json(orderStatus)
    } catch (err) {
      return next(err)
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const orderStatus = await OrderService.updateOrderStatus(req.params.id, req.body)

      return res.status(200).json(orderStatus)
    } catch (err) {
      return next(err)
    }
  }

  async deleteOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.deleteOrderStatus(req.params.id)

      return res.status(200).json(order)
    } catch (error) {
      return next(error)
    }
  }
}

export default new OrderController()
