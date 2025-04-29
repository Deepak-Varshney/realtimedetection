'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function Expenseform() {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    date: '',
    paidBy: '',
    notes: '',
  })

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('/api/expenses', {
        ...formData,
        amount: parseFloat(formData.amount),
      })

      console.log('Expense submitted:', response.data)
      alert('Expense added successfully!')

      // Reset form
      setFormData({
        name: '',
        amount: '',
        category: '',
        date: '',
        paidBy: '',
        notes: '',
      })
    } catch (error) {
      console.error('Error submitting expense:', error)
      alert('Failed to add expense')
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Add Society Expense</CardTitle>
        <CardDescription>Log a new expense made by the society admin.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Expense Name</Label>
            <Input
              id="name"
              placeholder="e.g. Security Guard Salary"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="e.g. 5000"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="salary">Staff Salary</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="paidBy">Paid By (Admin Name)</Label>
            <Input
              id="paidBy"
              placeholder="e.g. Mr. Sharma"
              value={formData.paidBy}
              onChange={(e) => handleChange('paidBy', e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes (optional)"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Submit Expense</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
