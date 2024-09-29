'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
interface ComplianceItem {
  category: string
  status: 'Compliant' | 'Non-Compliant' | 'Warning'
  details: string
}

export default function ReportPage() {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([])

  useEffect(() => {
    // Simulate fetching compliance data
    const fetchComplianceData = async () => {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setComplianceItems([
        {
          category: 'Data Protection',
          status: 'Compliant',
          details: 'All sensitive data is properly encrypted and stored securely.',
        },
        {
          category: 'Access Control',
          status: 'Warning',
          details: 'Some user accounts have overly broad permissions. Review and adjust as necessary.',
        },
        {
          category: 'Software Licensing',
          status: 'Non-Compliant',
          details: 'Several software licenses have expired. Renew immediately to ensure compliance.',
        },
        {
          category: 'Network Security',
          status: 'Compliant',
          details: 'Firewalls and intrusion detection systems are up-to-date and properly configured.',
        },
        {
          category: 'Disaster Recovery',
          status: 'Compliant',
          details: 'Backup and recovery procedures are in place and tested regularly.',
        },
      ])
    }

    fetchComplianceData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Compliance Report</h1>
        {complianceItems.map((item, index) => (
          <div key={index} className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {item.category}
              </h3>
              <p className={`mt-1 max-w-2xl text-sm ${
                item.status === 'Compliant' ? 'text-green-600' :
                item.status === 'Warning' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {item.status}
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Details
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {item.details}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}