'use server'

import nodemailer from 'nodemailer'
import { getClient } from '../../lib/clients'
import { setClientApproval } from '../../lib/notion'

export type FeedbackState = { success: boolean; message: string } | null

export async function submitFeedback(
  _prev: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  const clientSlug = String(formData.get('clientSlug') ?? '')
  const postId = String(formData.get('postId') ?? '')
  const postTitle = String(formData.get('postTitle') ?? '')
  const business = String(formData.get('business') ?? '')
  const postDate = String(formData.get('postDate') ?? '')
  const action = String(formData.get('action') ?? '') // 'Approved' | 'Changes requested'
  const comment = String(formData.get('comment') ?? '').trim()

  const cfg = getClient(clientSlug)
  if (!cfg || !postTitle || !action) {
    return { success: false, message: 'Something went wrong — please try again.' }
  }
  if (action === 'Changes requested' && !comment) {
    return { success: false, message: 'Please describe the changes you’d like.' }
  }

  const isApprove = action === 'Approved'

  // 1) Write the decision back to the Notion board (best-effort).
  await setClientApproval(postId, isApprove ? 'Approved' : 'Changes Requested')
  const tag = isApprove ? '✅ APPROVED' : '✏️ CHANGES REQUESTED'
  const accent = isApprove ? '#1F8A55' : '#B8860B'

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    })

    await transporter.sendMail({
      from: `"OnetyOne Client Hub" <${process.env.GMAIL_USER}>`,
      to: 'info.onetyone@gmail.com',
      subject: `[${cfg.name}] ${tag} — ${postTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; color: #1E0045;">
          <span style="display:inline-block; background:${accent}; color:#fff; font-size:12px; font-weight:bold; letter-spacing:0.05em; padding:6px 12px; border-radius:999px;">${tag}</span>
          <h2 style="margin: 18px 0 4px; font-size: 22px;">${postTitle}</h2>
          <p style="margin:0 0 20px; color:#6B5B95; font-size:14px;">
            ${cfg.name} &middot; ${business}${postDate ? ` &middot; scheduled ${postDate}` : ''}
          </p>
          ${
            comment
              ? `<div style="padding:16px; background:#F7F3FD; border-left:3px solid ${accent}; border-radius:6px;">
                   <strong style="font-size:13px; color:#6B5B95;">Client note:</strong>
                   <p style="margin:6px 0 0; white-space:pre-wrap;">${comment}</p>
                 </div>`
              : `<p style="color:#6B5B95;">No additional comments.</p>`
          }
          <p style="margin-top:24px; font-size:12px; color:#9B8BC2;">
            Sent from the ${cfg.name} client hub.
          </p>
        </div>
      `,
    })

    return {
      success: true,
      message: isApprove
        ? 'Approved — thanks! We’ve let OnetyOne know. 🎉'
        : 'Sent! OnetyOne has your changes and will be in touch.',
    }
  } catch (err) {
    console.error('[portal] feedback email error:', err)
    return {
      success: false,
      message: 'Couldn’t send just now. Please email info.onetyone@gmail.com or call us.',
    }
  }
}
